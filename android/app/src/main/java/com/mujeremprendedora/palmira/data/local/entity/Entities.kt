package com.mujeremprendedora.palmira.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String,
    val documentId: String,
    val phone: String,
    val email: String,
    val businessName: String,
    val businessCategory: String,
    val location: String, // Vereda o Corregimiento de Palmira
    val description: String,
    val isDemoProfile: Boolean = false
)

@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val name: String,
    val description: String,
    val price: Double,
    val stock: Int,
    val unit: String, // unidad, frasco, paquete, etc.
    val category: String,
    val minStockAlert: Int = 3,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "sales")
data class SaleEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val date: Long = System.currentTimeMillis(),
    val totalAmount: Double,
    val paymentMethod: String, // Efectivo, Nequi/Daviplata, etc.
    val customerName: String? = null,
    val customerNotes: String? = null,
    val itemsJson: String, // Lista serializada de items vendidos
    val synced: Boolean = false
)

@Entity(tableName = "sync_queue")
data class SyncOperationEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(), // Clave de idempotencia UUID v4
    val userId: String,
    val entityType: String, // PRODUCT, SALE, USER_PROFILE, LESSON_PROGRESS, QUIZ_RESULT, CERTIFICATE
    val action: String, // CREATE, UPDATE, DELETE
    val payloadJson: String,
    val timestamp: Long = System.currentTimeMillis(),
    val status: String = "PENDING", // PENDING, SYNCING, SYNCED, FAILED
    val retryCount: Int = 0,
    val errorMessage: String? = null
)

@Entity(tableName = "lesson_progress")
data class LessonProgressEntity(
    @PrimaryKey val id: String, // userId_lessonId
    val userId: String,
    val lessonId: String,
    val isCompleted: Boolean,
    val completedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "quiz_results")
data class QuizResultEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val moduleId: String,
    val score: Int,
    val totalQuestions: Int,
    val percentage: Int,
    val passed: Boolean,
    val answersJson: String,
    val completedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "certificates")
data class CertificateEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val moduleId: String,
    val moduleTitle: String,
    val userName: String,
    val verificationCode: String, // ej. ME-PALMIRA-2024-XXXX
    val issueDate: Long = System.currentTimeMillis(),
    val grade: Int,
    val isVerified: Boolean = true
)
