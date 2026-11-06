package com.mujeremprendedora.palmira.data.local

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
