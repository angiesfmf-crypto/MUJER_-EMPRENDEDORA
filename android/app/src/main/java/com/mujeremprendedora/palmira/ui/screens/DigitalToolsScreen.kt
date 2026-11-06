package com.mujeremprendedora.palmira.ui.screens

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
        ),
        DigitalToolItem(
            name = "Google Forms",
            category = "Formularios y Encuestas",
            description = "Creación de encuestas y formularios para pedidos anticipados.",
            ruralUtility = "Conocer de antemano cuántos pedidos entregar en la feria de Palmira.",
            example = "Formulario para reservas de mermeladas en ferias campesinas.",
            officialUrl = "https://docs.google.com/forms",
            pricing = "100% Gratuito",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "Meta Business Suite",
            category = "Redes Sociales y Marketing",
            description = "Administración conjunta de Facebook e Instagram para empresas.",
            ruralUtility = "Programar publicaciones de tus productos para toda la semana.",
            example = "Publicar a la vez en Facebook e Instagram los martes y jueves.",
            officialUrl = "https://business.facebook.com",
            pricing = "100% Gratuito",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "Nequi Colombia",
            category = "Pagos y Finanzas Rurales",
            description = "Billetera digital para cobros y transferencias inmediatas sin cuota de manejo.",
            ruralUtility = "Cobrar con código QR impreso en el puesto sin dar cambio en efectivo.",
            example = "Código QR plastificado en la mesa de la feria artesanal.",
            officialUrl = "https://www.nequi.com.co",
            pricing = "Billetera Móvil Sin Cobro",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "Daviplata",
            category = "Pagos y Finanzas Rurales",
            description = "Depósito digital de Davivienda para recibir pagos sin cuenta bancaria.",
            ruralUtility = "Recibir pagos de clientas de Palmira y retirar en cajeros sin comisión.",
            example = "Recepción de pagos para envíos a domicilio.",
            officialUrl = "https://www.daviplata.com",
            pricing = "Billetera Móvil Sin Cobro",
            requiresInternet = true
        ),
        DigitalToolItem(
            name = "CapCut",
            category = "Video y Contenido Móvil",
            description = "Editor de video para celular ágil y fácil de usar.",
            ruralUtility = "Grabar cómo revuelves el dulce o cosechas el café y ponerle música.",
            example = "Video de 15 segundos para estados de WhatsApp y Reels.",
            officialUrl = "https://www.capcut.com",
            pricing = "Gratis con opciones Pro",
            requiresInternet = false
        ),
        DigitalToolItem(
            name = "Google Maps (Perfil de Empresa)",
            category = "Presencia Local y Mapas",
            description = "Aparición en Google Maps y búsquedas locales para atraer turistas.",
            ruralUtility = "Que los visitantes de Cali y Palmira encuentren tu taller o vivero rural.",
            example = "Ubicación GPS exacta con fotos de tus plantas y productos.",
            officialUrl = "https://www.google.com/business",
            pricing = "100% Gratuito",
            requiresInternet = true
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
                                    // Image(painter = painterResource(tool.officialLogoRes), contentDescription = "Logotipo oficial de ${tool.name}")
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

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(tool.description, fontSize = 13.sp, color = TextSecondary)

                        Spacer(modifier = Modifier.height(8.dp))
                        Surface(
                            color = GreenLight,
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                "💡 Utilidad rural: ${tool.ruralUtility}",
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
