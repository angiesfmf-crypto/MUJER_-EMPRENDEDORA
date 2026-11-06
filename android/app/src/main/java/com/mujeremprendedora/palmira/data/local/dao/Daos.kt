package com.mujeremprendedora.palmira.data.local.dao

import androidx.room.*
import com.mujeremprendedora.palmira.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductDao {
    @Query("SELECT * FROM products WHERE userId = :userId ORDER BY name ASC")
    fun getProductsByUser(userId: String): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE id = :productId LIMIT 1")
    suspend fun getProductById(productId: String): ProductEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(product: ProductEntity)

    @Delete
    suspend fun delete(product: ProductEntity)

    @Query("UPDATE products SET stock = stock - :quantity, updatedAt = :timestamp WHERE id = :productId AND stock >= :quantity")
    suspend fun deductStock(productId: String, quantity: Int, timestamp: Long): Int
}

@Dao
interface SaleDao {
    @Query("SELECT * FROM sales WHERE userId = :userId ORDER BY date DESC")
    fun getSalesByUser(userId: String): Flow<List<SaleEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(sale: SaleEntity)
}

@Dao
interface SyncQueueDao {
    @Query("SELECT * FROM sync_queue WHERE status = 'PENDING' ORDER BY timestamp ASC")
    suspend fun getPendingOperations(): List<SyncOperationEntity>

    @Query("SELECT COUNT(*) FROM sync_queue WHERE status = 'PENDING'")
    fun getPendingCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun enqueue(operation: SyncOperationEntity)

    @Update
    suspend fun update(operation: SyncOperationEntity)

    @Query("DELETE FROM sync_queue WHERE status = 'SYNCED'")
    suspend fun deleteSynced()
}

@Dao
interface UserDao {
    @Query("SELECT * FROM users ORDER BY name ASC")
    fun getAllUsers(): Flow<List<UserEntity>>

    @Query("SELECT * FROM users WHERE id = :userId LIMIT 1")
    suspend fun getUserById(userId: String): UserEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(user: UserEntity)
}

@Dao
interface LessonProgressDao {
    @Query("SELECT lessonId FROM lesson_progress WHERE userId = :userId AND isCompleted = 1")
    fun getCompletedLessonIds(userId: String): Flow<List<String>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveProgress(progress: LessonProgressEntity)
}

@Dao
interface QuizResultDao {
    @Query("SELECT * FROM quiz_results WHERE userId = :userId AND moduleId = :moduleId ORDER BY completedAt DESC LIMIT 1")
    suspend fun getLatestResult(userId: String, moduleId: String): QuizResultEntity?

    @Query("SELECT * FROM quiz_results WHERE userId = :userId")
    fun getAllResultsByUser(userId: String): Flow<List<QuizResultEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(result: QuizResultEntity)
}

@Dao
interface CertificateDao {
    @Query("SELECT * FROM certificates WHERE userId = :userId ORDER BY issueDate DESC")
    fun getCertificatesByUser(userId: String): Flow<List<CertificateEntity>>

    @Query("SELECT * FROM certificates WHERE verificationCode = :code LIMIT 1")
    suspend fun getByVerificationCode(code: String): CertificateEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(certificate: CertificateEntity)
}
