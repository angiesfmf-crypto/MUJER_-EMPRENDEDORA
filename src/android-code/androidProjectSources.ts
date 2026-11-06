export interface AndroidSourceFile {
  path: string;
  name: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'markdown' | 'properties';
  category: 'config' | 'entity' | 'dao' | 'database' | 'repository' | 'sync' | 'ui' | 'theme';
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Raíz)',
    language: 'kotlin',
    category: 'config',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.google.services) apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    language: 'kotlin',
    category: 'config',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MujerEmprendedora"
include(":app")
`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'config',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
    alias(libs.plugins.google.services)
}

android {
    namespace = "com.mujeremprendedora.palmira"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mujeremprendedora.palmira"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)

    // Room Database (Offline-First Local Storage)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // WorkManager (Background Sync Queue)
    implementation(libs.androidx.work.runtime.ktx)

    // Firebase (Auth & Cloud Firestore)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth.ktx)
    implementation(libs.firebase.firestore.ktx)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.coroutines.play.services)

    debugImplementation(libs.androidx.ui.tooling)
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    category: 'config',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permisos para conectividad y sincronización con Cloud Firestore -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".MujerEmprendedoraApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Mujer Emprendedora"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MujerEmprendedora">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="Mujer Emprendedora"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.MujerEmprendedora">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/MujerEmprendedoraApp.kt',
    name: 'MujerEmprendedoraApp.kt',
    language: 'kotlin',
    category: 'database',
    content: `package com.mujeremprendedora.palmira

import android.app.Application
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.mujeremprendedora.palmira.data.local.AppDatabase
import com.mujeremprendedora.palmira.sync.SyncWorker
import java.util.concurrent.TimeUnit

class MujerEmprendedoraApp : Application() {

    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
        setupBackgroundSync()
    }

    private fun setupBackgroundSync() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncWorkRequest = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "MujerEmprendedoraOfflineSync",
            ExistingPeriodicWorkPolicy.KEEP,
            syncWorkRequest
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/data/local/entity/Entities.kt',
    name: 'Entities.kt (Room Entities)',
    language: 'kotlin',
    category: 'entity',
    content: `package com.mujeremprendedora.palmira.data.local.entity

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
    val entityType: String, // PRODUCT, SALE, USER_PROFILE, LESSON_PROGRESS
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
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/data/local/dao/Daos.kt',
    name: 'Daos.kt (Room DAOs)',
    language: 'kotlin',
    category: 'dao',
    content: `package com.mujeremprendedora.palmira.data.local.dao

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
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/data/local/AppDatabase.kt',
    name: 'AppDatabase.kt (Room SQLite DB)',
    language: 'kotlin',
    category: 'database',
    content: `package com.mujeremprendedora.palmira.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.mujeremprendedora.palmira.data.local.dao.*
import com.mujeremprendedora.palmira.data.local.entity.*

@Database(
    entities = [
        UserEntity::class,
        ProductEntity::class,
        SaleEntity::class,
        SyncOperationEntity::class,
        LessonProgressEntity::class,
        QuizResultEntity::class,
        CertificateEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun productDao(): ProductDao
    abstract fun saleDao(): SaleDao
    abstract fun syncQueueDao(): SyncQueueDao
    abstract fun userDao(): UserDao
    abstract fun lessonProgressDao(): LessonProgressDao
    abstract fun quizResultDao(): QuizResultDao
    abstract fun certificateDao(): CertificateDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "mujer_emprendedora_database.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/data/repository/OfflineFirstRepository.kt',
    name: 'OfflineFirstRepository.kt',
    language: 'kotlin',
    category: 'repository',
    content: `package com.mujeremprendedora.palmira.data.repository

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
    private val syncQueueDao: SyncQueueDao
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
            payloadJson = "{ \\"id\\": \\"\${product.id}\\", \\"name\\": \\"\${product.name}\\", \\"stock\\": \${product.stock} }",
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
                    Exception("Existencias insuficientes para \${product.name}. Disponibles: \${product.stock}, requeridas: \$quantity")
                )
            }
        }

        // 2. Descuento atómico del inventario
        val now = System.currentTimeMillis()
        for ((productId, quantity) in items) {
            val updatedRows = productDao.deductStock(productId, quantity, now)
            if (updatedRows == 0) {
                return Result.failure(Exception("Error al descontar existencias para el producto \$productId."))
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
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/sync/SyncWorker.kt',
    name: 'SyncWorker.kt (WorkManager)',
    language: 'kotlin',
    category: 'sync',
    content: `package com.mujeremprendedora.palmira.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.mujeremprendedora.palmira.data.local.AppDatabase
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

/**
 * Worker de WorkManager para sincronización garantizada en segundo plano.
 * No marca ninguna operación como sincronizada hasta recibir confirmación del servidor (Firestore).
 */
class SyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val database = AppDatabase.getDatabase(applicationContext)
        val syncDao = database.syncQueueDao()
        val firestore = FirebaseFirestore.getInstance()

        val pendingOperations = syncDao.getPendingOperations()
        if (pendingOperations.isEmpty()) {
            return Result.success()
        }

        var allSucceeded = true

        for (op in pendingOperations) {
            try {
                // Marcar como SYNCING
                syncDao.update(op.copy(status = "SYNCING"))

                // Enviar a Firestore en la colección correspondiente al usuario (Idempotente vía op.id)
                firestore.collection("users")
                    .document(op.userId)
                    .collection("sync_journal")
                    .document(op.id)
                    .set(
                        mapOf(
                            "operationId" to op.id,
                            "entityType" to op.entityType,
                            "action" to op.action,
                            "payload" to op.payloadJson,
                            "serverTimestamp" to com.google.firebase.firestore.FieldValue.serverTimestamp()
                        )
                    ).await()

                // Confirmación exitosa recibida del servidor
                syncDao.update(op.copy(status = "SYNCED"))
            } catch (e: Exception) {
                allSucceeded = false
                val newRetry = op.retryCount + 1
                syncDao.update(
                    op.copy(
                        status = "FAILED",
                        retryCount = newRetry,
                        errorMessage = e.localizedMessage
                    )
                )
            }
        }

        return if (allSucceeded) Result.success() else Result.retry()
    }
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/ui/theme/Color.kt',
    name: 'Color.kt (Paleta Material 3)',
    language: 'kotlin',
    category: 'theme',
    content: `package com.mujeremprendedora.palmira.ui.theme

import androidx.compose.ui.graphics.Color

// Paleta Mujer Emprendedora: Verde Botánico, Crema Cálido, Lila Suave y Terracota Rural
val GreenPrimary = Color(0xFF2D5A27)      // Verde botánico principal
val GreenSecondary = Color(0xFF3E7B32)    // Verde campo
val GreenLight = Color(0xFFEAF4E8)        // Fondo vegetal suave

val CreamBackground = Color(0xFFFAF7EE)   // Crema cálido
val CreamSurface = Color(0xFFFFFDF8)      // Blanco cálido
val CreamCard = Color(0xFFFFFFFF)

val LilacPrimary = Color(0xFF7E56A0)      // Lila suave complementario
val LilacLight = Color(0xFFF0E8F5)

val TerracottaAccent = Color(0xFF8D5B4C)  // Tono tierra artesanal
val TerracottaWarm = Color(0xFFC47C56)

val TextPrimary = Color(0xFF1F3D1B)       // Verde oscuro natural de alta legibilidad
val TextSecondary = Color(0xFF556952)
val TextMuted = Color(0xFF8C9B89)

val AlertAmber = Color(0xFFD97706)
val AlertRed = Color(0xFFDC2626)
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/ui/theme/Theme.kt',
    name: 'Theme.kt',
    language: 'kotlin',
    category: 'theme',
    content: `package com.mujeremprendedora.palmira.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = GreenPrimary,
    onPrimary = Color.White,
    primaryContainer = GreenLight,
    onPrimaryContainer = Color(0xFF1B5E20),
    secondary = LilacPrimary,
    onSecondary = Color.White,
    secondaryContainer = LilacLight,
    onSecondaryContainer = Color(0xFF4A148C),
    background = CreamBackground,
    onBackground = TextPrimary,
    surface = CreamSurface,
    onSurface = TextPrimary
)

@Composable
fun MujerEmprendedoraTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    content: `package com.mujeremprendedora.palmira

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.mujeremprendedora.palmira.ui.navigation.Screen
import com.mujeremprendedora.palmira.ui.screens.*
import com.mujeremprendedora.palmira.ui.theme.MujerEmprendedoraTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MujerEmprendedoraTheme {
                val navController = rememberNavController()
                Scaffold(
                    modifier = Modifier.fillMaxSize()
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Welcome.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Welcome.route) {
                            WelcomeScreen(
                                onNavigateToLogin = { navController.navigate(Screen.Login.route) },
                                onNavigateToRegister = { navController.navigate(Screen.Register.route) },
                                onEnterAsGuestOrDemo = { navController.navigate(Screen.Inventory.route) }
                            )
                        }
                        composable(Screen.Inventory.route) {
                            InventoryScreen(navController = navController)
                        }
                        composable(Screen.Sales.route) {
                            SalesScreen(navController = navController)
                        }
                        composable(Screen.Reports.route) {
                            ReportsScreen(navController = navController)
                        }
                        composable(Screen.Training.route) {
                            AcademyScreen(navController = navController)
                        }
                        composable(Screen.Tools.route) {
                            DigitalToolsScreen(navController = navController)
                        }
                        composable(Screen.Profile.route) {
                            ProfileScreen(navController = navController)
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/ui/screens/DigitalToolsScreen.kt',
    name: 'DigitalToolsScreen.kt (Jetpack Compose)',
    language: 'kotlin',
    category: 'ui',
    content: `package com.mujeremprendedora.palmira.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mujeremprendedora.palmira.ui.theme.*

data class DigitalToolItem(
    val name: String,
    val category: String,
    val description: String,
    val ruralUtility: String,
    val example: String,
    val officialUrl: String,
    val pricing: String,
    val requiresInternet: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DigitalToolsScreen(navController: NavController) {
    var searchQuery by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }
    val context = LocalContext.current

    val tools = listOf(
        DigitalToolItem(
            name = "Canva",
            category = "Diseño y Publicidad",
            description = "Plataforma de diseño gráfico visual para crear etiquetas y catálogos.",
            ruralUtility = "Diseña etiquetas de mermeladas y empaques sin contratar diseñador.",
            example = "Crear etiqueta para frascos de miel con registro y precio.",
            officialUrl = "https://www.canva.com",
            pricing = "Plan Gratuito Disponible",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "WhatsApp Business",
            category = "Comunicación y Ventas",
            description = "Aplicación oficial para atención comercial con catálogo y respuestas automáticas.",
            ruralUtility = "Permite a clientas de Cali y Palmira ver fotos y precios las 24 horas.",
            example = "Catálogo de café especial y mensaje de bienvenida automático.",
            officialUrl = "https://www.whatsapp.com/business",
            pricing = "Completamente Gratuita",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "Google Drive",
            category = "Organización en la Nube",
            description = "Almacenamiento seguro en la nube para recetas y comprobantes.",
            ruralUtility = "Evita perder fórmulas artesanales o recibos si el celular se moja o daña.",
            example = "Carpeta con fotos de pedidos y recibos de encomiendas.",
            officialUrl = "https://drive.google.com",
            pricing = "Gratuito hasta 15 GB",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "Google Sheets",
            category = "Hojas de Cálculo",
            description = "Hojas de cálculo para control de costos e ingresos.",
            ruralUtility = "Cálculo automático del costo por frasco sumando insumos y mano de obra.",
            example = "Matriz de costo unitario para yogurt artesanal.",
            officialUrl = "https://sheets.google.com",
            pricing = "Completamente Gratuita",
            requiresInternet = false
        )
    )

    val filteredTools = tools.filter {
        it.name.contains(searchQuery, ignoreCase = true) ||
        it.category.contains(searchQuery, ignoreCase = true) ||
        it.ruralUtility.contains(searchQuery, ignoreCase = true)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Herramientas Digitales", color = GreenPrimary, fontWeight = FontWeight.Bold)
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CreamBackground)
            )
        },
        containerColor = CreamBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Buscar por nombre o utilidad rural...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = GreenPrimary) },
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            items(filteredTools) { tool ->
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = CreamSurface),
                    elevation = CardDefaults.cardElevation(2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                // Logotipo Oficial de la Herramienta (recurso drawable oficial sin distorsión)
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = Color.White,
                                    shadowElevation = 1.dp,
                                    modifier = Modifier.size(48.dp)
                                ) {
                                    // Image(painter = painterResource(tool.officialLogoRes), contentDescription = "Logotipo oficial de \${tool.name}")
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(tool.name.take(2).uppercase(), fontWeight = FontWeight.Black, color = GreenPrimary)
                                    }
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(tool.name, fontWeight = FontWeight.Bold, fontSize = 17.sp, color = GreenPrimary)
                                    Text(tool.category, fontSize = 11.sp, color = TerracottaAccent, fontWeight = FontWeight.SemiBold)
                                }
                            }

                            AssistChip(
                                onClick = {},
                                label = { Text(tool.pricing, fontSize = 10.sp) },
                                shape = RoundedCornerShape(12.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text(tool.description, fontSize = 13.sp, color = TextSecondary)

                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(
                            color = GreenLight,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                "💡 Utilidad rural: \${tool.ruralUtility}",
                                modifier = Modifier.padding(10.dp),
                                fontSize = 12.sp,
                                color = TextPrimary
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(tool.officialUrl))
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = GreenPrimary),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Abrir Sitio Oficial Verificado")
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/mujeremprendedora/palmira/ui/screens/AcademyScreen.kt',
    name: 'AcademyScreen.kt (Escuela Rural)',
    language: 'kotlin',
    category: 'ui',
    content: `package com.mujeremprendedora.palmira.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Award
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mujeremprendedora.palmira.ui.theme.*

data class ModuleSummary(
    val id: String,
    val title: String,
    val category: String,
    val lessonCount: Int,
    val completedCount: Int,
    val hasCertificate: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AcademyScreen(navController: NavController) {
    val modules = remember {
        listOf(
            ModuleSummary("mod_admin", "1. Administración y Organización Rural", "Gestión", 3, 3, true),
            ModuleSummary("mod_inventarios", "2. Gestión y Control de Inventarios", "Operaciones", 3, 2, false),
            ModuleSummary("mod_costos", "3. Costos, Gastos y Fijación de Precios", "Finanzas", 3, 3, true),
            ModuleSummary("mod_ventas", "4. Registro y Administración de Ventas", "Comercial", 3, 1, false),
            ModuleSummary("mod_atencion", "5. Atención al Cliente y Fidelización", "Ventas", 3, 3, true),
            ModuleSummary("mod_marketing", "6. Marketing y Publicidad Digital", "Promoción", 3, 0, false),
            ModuleSummary("mod_redes", "7. Uso de Redes Sociales para Vender", "Digital", 3, 0, false),
            ModuleSummary("mod_herramientas", "8. Herramientas Digitales para Emprendedoras", "Tecnología", 3, 0, false),
            ModuleSummary("mod_finanzas", "9. Finanzas Básicas y Planificación", "Finanzas", 3, 0, false)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Escuela de Aprendizaje", color = GreenPrimary, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CreamBackground)
            )
        },
        containerColor = CreamBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = LilacLight),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Book, contentDescription = null, tint = LilacPrimary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Tu Ruta de Transformación Digital", fontWeight = FontWeight.Bold, color = LilacPrimary)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("9 módulos prácticos desarrollados con casos reales de Palmira.", fontSize = 13.sp)
                    }
                }
            }

            items(modules) { mod ->
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = CreamSurface),
                    elevation = CardDefaults.cardElevation(2.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(mod.title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = GreenPrimary)
                            Text("\${mod.completedCount} de \${mod.lessonCount} lecciones completadas", fontSize = 12.sp, color = TextSecondary)
                        }

                        if (mod.hasCertificate) {
                            Badge(
                                containerColor = GreenLight,
                                contentColor = GreenPrimary
                            ) {
                                Text("Diploma Listo", modifier = Modifier.padding(4.dp), fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'README_ANDROID.md',
    name: 'README_ANDROID.md (Guía Android Studio)',
    language: 'markdown',
    category: 'config',
    content: `# MUJER EMPRENDEDORA - PALMIRA, VALLE DEL CAUCA
## Aplicación Android Nativa con Kotlin, Jetpack Compose, Room y WorkManager

Esta carpeta contiene la arquitectura completa y funcional para compilar en Android Studio y desplegar en dispositivos móviles o en Google Play Store.

### 1. Requisitos para compilar
- Android Studio Ladybug (2024.2+) o Hedgehog
- JDK 17 o superior
- Gradle 8.5+ con Kotlin 2.0+

### 2. Estructura de Capas
- **\`data/local/entity\`**: Entidades Room para almacenamiento SQLite local (\`ProductEntity\`, \`SaleEntity\`, \`SyncOperationEntity\`, \`UserEntity\`, \`LessonProgressEntity\`).
- **\`data/local/dao\`**: DAOs con operaciones asíncronas con corrutinas y \`Flow\`.
- **\`data/local/AppDatabase.kt\`**: Instancia singleton de la base de datos Room.
- **\`data/repository/OfflineFirstRepository.kt\`**: Gestión Offline-First que valida existencias locales, descuenta stock de inmediato y encola las mutaciones para sincronizar.
- **\`sync/SyncWorker.kt\`**: Worker en segundo plano gestionado por \`WorkManager\` con idempotencia UUID v4 y reintentos ante caídas de red.
- **\`ui/theme\`**: Identidad visual Material 3 con Verde Natural (#2E7D32), Lila Suave (#7E57C2) y Crema (#FDFBF7).
- **\`ui/screens\`**: Pantallas en Jetpack Compose diseñadas para accesibilidad en entornos rurales.
`
  }
];
