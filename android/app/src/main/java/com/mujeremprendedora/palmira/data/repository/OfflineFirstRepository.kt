package com.mujeremprendedora.palmira.data.repository

import com.mujeremprendedora.palmira.data.local.dao.*
import com.mujeremprendedora.palmira.data.local.entity.*
import kotlinx.coroutines.flow.Flow
import java.util.UUID

/**
 * Repositorio Offline-First que implementa la separación estricta entre almacenamiento local (Room)
 * y almacenamiento remoto (Cloud Firestore), garantizando la disponibilidad completa sin internet.
 */
class OfflineFirstRepository(
    private val productDao: ProductDao,
    private val saleDao: SaleDao,
    private val syncQueueDao: SyncQueueDao,
    private val quizResultDao: QuizResultDao,
    private val certificateDao: CertificateDao
) {
    fun getProducts(userId: String): Flow<List<ProductEntity>> = productDao.getProductsByUser(userId)
    fun getSales(userId: String): Flow<List<SaleEntity>> = saleDao.getSalesByUser(userId)
    fun getPendingSyncCount(): Flow<Int> = syncQueueDao.getPendingCount()

    suspend fun saveProduct(product: ProductEntity, isOnline: Boolean) {
        // 1. Guardar de forma inmediata en Room SQLite
        productDao.insertOrUpdate(product)

        // 2. Encolar operación con UUID de idempotencia para sincronizar con Firestore
        val operation = SyncOperationEntity(
            id = UUID.randomUUID().toString(),
            userId = product.userId,
            entityType = "PRODUCT",
            action = "SAVE",
            payloadJson = "{ \"id\": \"${product.id}\", \"name\": \"${product.name}\", \"stock\": ${product.stock} }",
            status = if (isOnline) "SYNCED" else "PENDING"
        )
        syncQueueDao.enqueue(operation)
    }

    suspend fun registerSale(sale: SaleEntity, items: List<Pair<String, Int>>, isOnline: Boolean): Result<Unit> {
        // 1. Validar existencias de cada producto
        for ((productId, quantity) in items) {
            val product = productDao.getProductById(productId)
                ?: return Result.failure(Exception("El producto seleccionado no existe."))
            if (product.stock < quantity) {
                return Result.failure(
                    Exception("Existencias insuficientes para ${product.name}. Disponibles: ${product.stock}, requeridas: $quantity")
                )
            }
        }

        // 2. Descuento atómico del inventario
        val now = System.currentTimeMillis()
        for ((productId, quantity) in items) {
            val updatedRows = productDao.deductStock(productId, quantity, now)
            if (updatedRows == 0) {
                return Result.failure(Exception("Error al descontar existencias para el producto $productId."))
            }
        }

        // 3. Registrar venta en base de datos local
        saleDao.insert(sale)

        // 4. Encolar en la cola de sincronización persistente
        val syncOp = SyncOperationEntity(
            id = UUID.randomUUID().toString(),
            userId = sale.userId,
            entityType = "SALE",
            action = "CREATE",
            payloadJson = sale.itemsJson,
            status = if (isOnline) "SYNCED" else "PENDING"
        )
        syncQueueDao.enqueue(syncOp)

        return Result.success(Unit)
    }

    suspend fun recordQuizResult(result: QuizResultEntity, isOnline: Boolean) {
        quizResultDao.insertOrUpdate(result)
        syncQueueDao.enqueue(
            SyncOperationEntity(
                id = UUID.randomUUID().toString(),
                userId = result.userId,
                entityType = "QUIZ_RESULT",
                action = "CREATE",
                payloadJson = result.answersJson,
                status = if (isOnline) "SYNCED" else "PENDING"
            )
        )
    }

    suspend fun issueCertificate(certificate: CertificateEntity, isOnline: Boolean) {
        certificateDao.insertOrUpdate(certificate)
        syncQueueDao.enqueue(
            SyncOperationEntity(
                id = UUID.randomUUID().toString(),
                userId = certificate.userId,
                entityType = "CERTIFICATE",
                action = "CREATE",
                payloadJson = "{ \"code\": \"${certificate.verificationCode}\", \"moduleId\": \"${certificate.moduleId}\" }",
                status = if (isOnline) "SYNCED" else "PENDING"
            )
        )
    }
}
