import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Award,
  Download,
  Check,
  FileCheck,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Layers,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';
import { ACADEMY_MODULES } from '../../data/academyModulesData';
import { storage } from '../../services/storage';
import { AcademyModule, AcademyLesson, UserProfile, UserCertificate } from '../../types';
import { ModuleGuideBanner } from '../common/ModuleGuideBanner';
import { CertificateModal } from '../common/CertificateModal';

interface AcademyScreenProps {
  currentUser: UserProfile;
}

type LevelFilter = 'all' | 'level-1' | 'level-2' | 'level-3';

interface LevelGroup {
  id: LevelFilter;
  levelNumber: number;
  title: string;
  subtitle: string;
  moduleIds: string[];
}

const ACADEMY_LEVELS: LevelGroup[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    title: 'Comenzar desde cero',
    subtitle: 'Primeros pasos para formalizar el tiempo, usar el celular y atender clientas.',
    moduleIds: ['mod-1-admin', 'mod-8-herramientas', 'mod-5-servicio']
  },
  {
    id: 'level-2',
    levelNumber: 2,
    title: 'Organizar mi negocio',
    subtitle: 'Gestión de existencias, cálculo de costos reales, precios justos y manejo del dinero.',
    moduleIds: ['mod-2-inventarios', 'mod-3-costos', 'mod-9-finanzas']
  },
  {
    id: 'level-3',
    levelNumber: 3,
    title: 'Hacer crecer mi emprendimiento',
    subtitle: 'Ventas en ferias campesinas, fotografía con celular y catálogo en WhatsApp.',
    moduleIds: ['mod-4-ventas', 'mod-6-marketing', 'mod-7-redes']
  }
];

export const AcademyScreen: React.FC<AcademyScreenProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'certificates'>('modules');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [selectedModule, setSelectedModule] = useState<AcademyModule | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [viewingQuiz, setViewingQuiz] = useState<boolean>(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Certificate Modal
  const [activeCertificateToView, setActiveCertificateToView] = useState<UserCertificate | null>(null);

  // Storage data
  const learningState = storage.getLearningState(currentUser.id);
  const completedLessonIds = learningState.completedLessonIds;
  const userCertificates = storage.getCertificates(currentUser.id);

  // Overall metrics
  const allLessons = useMemo(() => ACADEMY_MODULES.flatMap((m) => m.lessons), []);
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = completedLessonIds.length;
  const generalProgressPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  // Last visited module
  const lastModule =
    ACADEMY_MODULES.find((m) => m.id === learningState.lastVisitedModuleId) || ACADEMY_MODULES[0];

  const handleOpenModule = (module: AcademyModule, lessonIdx = 0) => {
    setSelectedModule(module);
    setCurrentLessonIndex(lessonIdx);
    setViewingQuiz(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    storage.setLastVisited(module.id, module.lessons[lessonIdx].id);
  };

  const handleToggleLesson = (lessonId: string, moduleId: string) => {
    storage.toggleLessonCompleted(lessonId, moduleId);
  };

  const handleToggleDownload = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    storage.toggleDownloadModule(moduleId);
  };

  const handleAnswerOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIdx
    });
  };

  const handleFinishQuiz = () => {
    if (!selectedModule) return;
    const questions = selectedModule.quiz.questions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= selectedModule.quiz.passingScorePercent;

    const result = storage.submitQuizResult(selectedModule.id, selectedAnswers, scorePercent, passed);
    setQuizSubmitted(true);

    if (passed && result.certificate) {
      setActiveCertificateToView(result.certificate);
    }
  };

  const currentLesson: AcademyLesson | undefined = selectedModule?.lessons[currentLessonIndex];

  return (
    <div className="flex-1 bg-[#FAF7EE] flex flex-col p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
      
      {/* ==================== VISTA 1: CATÁLOGO DE MÓDULOS ORGANIZADO POR NIVELES ==================== */}
      {!selectedModule && (
        <>
          {/* Guía Inicial */}
          <ModuleGuideBanner
            moduleKey="academy_main"
            title="Escuela de Aprendizaje TIC para Mujeres Rurales"
            description="Aprende paso a paso con explicaciones sencillas y ejemplos de mujeres de Palmira. Al completar cada módulo y su evaluación, recibirás tu constancia oficial con código de verificación."
            tips={[
              'Los cursos están organizados en 3 niveles: desde lo más básico hasta ventas avanzadas.',
              'Tu progreso se guarda automáticamente y puedes estudiar aunque no tengas internet en tu vereda.'
            ]}
          />

          {/* Tarjeta de Progreso General */}
          <div className="bg-[#FFFDF8] rounded-[32px] border-2 border-[#DFEBDC] p-6 sm:p-8 shadow-xs mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-[#EAF4E8] text-[#2D5A27] flex items-center justify-center border-2 border-[#BED6B8] shrink-0 shadow-xs">
                  <GraduationCap className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] block">
                    Escuela TIC • Palmira, Valle del Cauca
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F3D1B] tracking-tight mt-0.5">
                    Avance de {currentUser.name}
                  </h2>
                  <p className="text-base text-slate-600 mt-1">
                    {completedLessonsCount} de {totalLessonsCount} lecciones completadas ({generalProgressPercent}%) • {userCertificates.length} constancias obtenidas
                  </p>
                </div>
              </div>

              {/* Botón para continuar */}
              <button
                onClick={() => handleOpenModule(lastModule, 0)}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] text-white font-bold text-base shadow-md transition-all cursor-pointer self-start md:self-auto"
              >
                <span>Continuar Estudiando</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

            {/* Barra de Progreso */}
            <div className="mt-5 w-full h-4 bg-[#FAF7EE] rounded-full overflow-hidden p-0.5 border border-[#DFEBDC]">
              <div
                className="h-full bg-gradient-to-r from-[#2D5A27] to-[#7E56A0] rounded-full transition-all duration-500"
                style={{ width: `${generalProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Selector de Pestañas: Módulos vs Constancias */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex p-1.5 bg-[#FFFDF8] rounded-2xl border-2 border-[#DFEBDC] text-sm font-bold shadow-2xs">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'modules'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cursos por Niveles (9)
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'certificates'
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-[#D9825B]" />
                <span>Mis Constancias ({userCertificates.length})</span>
              </button>
            </div>

            {/* Filtro Rápido de Nivel (cuando está en la pestaña módulos) */}
            {activeTab === 'modules' && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-500 mr-1 text-sm">Ver:</span>
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevel === 'all'
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                      : 'bg-white text-slate-700 border-[#DFEBDC] hover:bg-[#FAF7EE]'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedLevel('level-1')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevel === 'level-1'
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                      : 'bg-white text-slate-700 border-[#DFEBDC] hover:bg-[#FAF7EE]'
                  }`}
                >
                  Nivel 1
                </button>
                <button
                  onClick={() => setSelectedLevel('level-2')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevel === 'level-2'
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                      : 'bg-white text-slate-700 border-[#DFEBDC] hover:bg-[#FAF7EE]'
                  }`}
                >
                  Nivel 2
                </button>
                <button
                  onClick={() => setSelectedLevel('level-3')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevel === 'level-3'
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                      : 'bg-white text-slate-700 border-[#DFEBDC] hover:bg-[#FAF7EE]'
                  }`}
                >
                  Nivel 3
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: MÓDULOS AGRUPADOS POR LOS 3 NIVELES */}
          {activeTab === 'modules' && (
            <div className="space-y-8">
              {ACADEMY_LEVELS.filter(
                (lvl) => selectedLevel === 'all' || selectedLevel === lvl.id
              ).map((level) => {
                const levelModules = ACADEMY_MODULES.filter((m) =>
                  level.moduleIds.includes(m.id)
                );

                return (
                  <div key={level.id} className="space-y-4">
                    
                    {/* Encabezado del Nivel (Claro y Accesible) */}
                    <div className="bg-[#FFFDF8] border-2 border-[#DFEBDC] p-4 sm:p-5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#2D5A27] text-white font-serif font-black text-sm flex items-center justify-center shrink-0">
                          {level.levelNumber}
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-serif font-black text-[#1F3D1B]">
                            Nivel {level.levelNumber}: {level.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-0.5">
                            {level.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rejilla de Módulos del Nivel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {levelModules.map((module) => {
                        const moduleCompletedCount = module.lessons.filter((l) =>
                          completedLessonIds.includes(l.id)
                        ).length;
                        const modulePercent = Math.round(
                          (moduleCompletedCount / module.lessons.length) * 100
                        );
                        const quizResult = learningState.quizResults[module.id];
                        const isCertified = quizResult && quizResult.passed;
                        const isDownloaded = learningState.downloadedModuleIds.includes(module.id);

                        return (
                          <div
                            key={module.id}
                            onClick={() => handleOpenModule(module, 0)}
                            className="p-5 sm:p-6 rounded-[28px] bg-[#FFFDF8] border-2 border-[#DFEBDC] hover:border-[#2D5A27] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                          >
                            <div>
                              {/* Barra superior de la tarjeta */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] bg-[#EAF4E8] px-3 py-1 rounded-xl border border-[#BED6B8]">
                                  Módulo #{module.order}
                                </span>

                                <button
                                  onClick={(e) => handleToggleDownload(e, module.id)}
                                  className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                                    isDownloaded
                                      ? 'bg-[#EAF4E8] text-[#1E4D1A] border-[#BED6B8]'
                                      : 'bg-[#FAF7EE] text-slate-500 border-[#DFEBDC] hover:text-slate-800'
                                  }`}
                                  title={isDownloaded ? 'Descargado en tu teléfono para estudiar sin red' : 'Descargar para estudiar sin conexión'}
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="font-bold">
                                    {isDownloaded ? 'Sin Red' : 'Descargar'}
                                  </span>
                                </button>
                              </div>

                              {/* Título de 18 a 20 px */}
                              <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-[#2D5A27] transition-colors mb-2">
                                {module.title}
                              </h4>

                              {/* Descripción de 16 px */}
                              <p className="text-base text-slate-600 line-clamp-2 leading-relaxed mb-4">
                                {module.description}
                              </p>
                            </div>

                            {/* Progreso y Acción */}
                            <div className="pt-3 border-t border-[#DFEBDC] space-y-2">
                              <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-600">
                                  {moduleCompletedCount} de {module.lessons.length} lecciones
                                </span>
                                <span className="text-[#2D5A27]">{modulePercent}%</span>
                              </div>

                              <div className="w-full h-2.5 bg-[#FAF7EE] rounded-full overflow-hidden border border-[#DFEBDC]">
                                <div
                                  className="h-full bg-[#2D5A27] rounded-full transition-all"
                                  style={{ width: `${modulePercent}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                {isCertified ? (
                                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Certificado Aprobado</span>
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-slate-500">
                                    Evaluación pendiente
                                  </span>
                                )}

                                <span className="text-sm font-bold text-[#2D5A27] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                  Abrir curso →
                                </span>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: MIS CONSTANCIAS */}
          {activeTab === 'certificates' && (
            <div className="bg-[#FFFDF8] rounded-[32px] border-2 border-[#DFEBDC] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#8D441F] flex items-center justify-center border border-[#E8C2AC]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900">
                    Constancias y Certificados Oficiales
                  </h3>
                  <p className="text-base text-slate-600">
                    Acreditan tu formación en comercio digital rural en Palmira
                  </p>
                </div>
              </div>

              {userCertificates.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <Award className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-base font-bold text-slate-700">
                    Aún no tienes constancias generadas.
                  </p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Completa las lecciones de un módulo y presenta la evaluación de conocimientos para obtener tu primer certificado digital.
                  </p>
                  <button
                    onClick={() => setActiveTab('modules')}
                    className="px-6 py-3 rounded-2xl bg-[#2D5A27] text-white font-bold text-sm cursor-pointer hover:bg-[#1F3D1B]"
                  >
                    Ver Cursos Disponibles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => setActiveCertificateToView(cert)}
                      className="p-5 rounded-3xl bg-[#FAF7EE] border-2 border-[#BED6B8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#2D5A27] bg-[#EAF4E8] px-2.5 py-0.5 rounded-lg border border-[#BED6B8]">
                            {cert.verificationCode}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {new Date(cert.issuedDate).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        <h4 className="font-serif font-black text-slate-900 text-lg leading-snug">
                          {cert.moduleTitle}
                        </h4>
                        <p className="text-sm text-slate-600">
                          Emprendedora: <strong>{cert.userName}</strong> ({cert.businessName})
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#DFEBDC] flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Nota: {cert.scorePercent}%
                        </span>
                        <span className="text-sm font-bold text-[#2D5A27] flex items-center gap-1">
                          Ver e Imprimir Certificado →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ==================== VISTA 2: LECCIÓN O EVALUACIÓN DEL MÓDULO ==================== */}
      {selectedModule && (
        <div className="space-y-6">
          
          {/* Barra Superior de Retorno */}
          <div className="bg-[#FFFDF8] rounded-2xl border-2 border-[#DFEBDC] p-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7EE] hover:bg-[#EAF4E8] text-[#1F3D1B] font-bold text-sm border border-[#DFEBDC] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a los Cursos</span>
            </button>

            <span className="text-xs sm:text-sm font-bold text-[#2D5A27] bg-[#EAF4E8] px-3 py-1 rounded-xl">
              Módulo #{selectedModule.order}: {selectedModule.shortTitle}
            </span>
          </div>

          {/* VISTA 2A: EVALUACIÓN / QUIZ */}
          {viewingQuiz ? (
            <div className="bg-[#FFFDF8] rounded-[32px] border-2 border-[#DFEBDC] p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="pb-4 border-b-2 border-[#DFEBDC]">
                <span className="text-xs font-black uppercase tracking-wider text-[#7E56A0] block">
                  Evaluación de Aprendizaje
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-1">
                  Comprueba lo que aprendiste en: {selectedModule.title}
                </h3>
                <p className="text-base text-slate-600 mt-1">
                  Responde las preguntas para desbloquear tu constancia oficial con código de verificación.
                </p>
              </div>

              {/* Preguntas */}
              <div className="space-y-6">
                {selectedModule.quiz.questions.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isSubmitted = quizSubmitted;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-[#FAF7EE] border-2 border-[#DFEBDC] space-y-3"
                    >
                      <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                        {qIndex + 1}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = userAnswer === optIndex;
                          return (
                            <div
                              key={optIndex}
                              onClick={() => handleAnswerOption(q.id, optIndex)}
                              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-base ${
                                isSelected
                                  ? 'bg-[#EAF4E8] border-[#2D5A27] font-bold text-[#1F3D1B]'
                                  : 'bg-white border-[#DFEBDC] text-slate-800 hover:bg-[#F3EFE6]'
                              }`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#2D5A27] bg-[#2D5A27] text-white' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                            isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span>¡Correcto! {q.explanation}</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                              <span>Respuesta correcta: {q.options[q.correctIndex]}. {q.explanation}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón de Enviar o Reintentar */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={handleFinishQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length < selectedModule.quiz.questions.length
                    }
                    className="w-full py-4 px-6 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] disabled:opacity-50 text-white font-bold text-base shadow-md transition-all cursor-pointer text-center"
                  >
                    Enviar Respuestas y Calificar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-[#7E56A0] hover:bg-[#684187] text-white font-bold text-base shadow-md transition-all cursor-pointer text-center"
                  >
                    Intentar de Nuevo
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* VISTA 2B: LECCIÓN DEL CURSO */
            currentLesson && (
              <div className="bg-[#FFFDF8] rounded-[32px] border-2 border-[#DFEBDC] p-6 sm:p-8 space-y-6 shadow-xs">
                
                {/* Cabecera de la Lección */}
                <div className="pb-4 border-b-2 border-[#DFEBDC] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#2D5A27] bg-[#EAF4E8] px-3 py-1 rounded-xl">
                      Lección {currentLessonIndex + 1} de {selectedModule.lessons.length}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentLesson.durationMinutes} minutos de lectura</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 leading-tight">
                    {currentLesson.title}
                  </h3>

                  <p className="text-base sm:text-lg text-[#3A5C33] font-serif italic leading-relaxed">
                    {currentLesson.summary}
                  </p>
                </div>

                {/* Introducción de 16-18 px */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7EE] border border-[#DFEBDC] text-base sm:text-lg text-slate-800 leading-relaxed">
                  {currentLesson.introduction}
                </div>

                {/* Secciones de Contenido Desarrolladas */}
                <div className="space-y-6">
                  {currentLesson.contentSections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-3">
                      <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                        {sec.subtitle}
                      </h4>

                      {sec.body.map((p, pIdx) => (
                        <p key={pIdx} className="text-base sm:text-lg text-slate-700 leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {sec.highlightBox && (
                        <div className="p-4 rounded-2xl bg-[#FAF0E6] border-2 border-[#E8C2AC] text-base text-[#8D441F] font-semibold">
                          💡 {sec.highlightBox}
                        </div>
                      )}

                      {/* Tabla Práctica si aplica */}
                      {sec.tableData && (
                        <div className="overflow-x-auto rounded-2xl border border-[#DFEBDC]">
                          <table className="w-full text-left text-sm sm:text-base">
                            <thead className="bg-[#FAF7EE] text-[#1F3D1B] font-bold border-b border-[#DFEBDC]">
                              <tr>
                                {sec.tableData.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-3">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DFEBDC]">
                              {sec.tableData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-[#FAF7EE]/50">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-3">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Caso Práctico Rural de Palmira */}
                {currentLesson.practicalCase && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-[#F0E8F5] border-2 border-[#D5C2E3] space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#7E56A0] block">
                      Ejemplo Real en Palmira
                    </span>
                    <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                      {currentLesson.practicalCase.title}
                    </h4>
                    <p className="text-base text-slate-800 leading-relaxed">
                      {currentLesson.practicalCase.story}
                    </p>
                    <div className="p-3.5 rounded-xl bg-white/80 border border-[#D5C2E3] text-sm sm:text-base text-[#553075] font-semibold">
                      ✓ <strong>Lección aprendida:</strong> {currentLesson.practicalCase.keyTakeaway}
                    </div>
                  </div>
                )}

                {/* Ejercicio Práctico Paso a Paso */}
                {currentLesson.activity && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF0E6] border-2 border-[#E8C2AC] space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#8D441F] block">
                      Paso a Paso en tu Finca o Taller
                    </span>
                    <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl">
                      {currentLesson.activity.title}
                    </h4>
                    <p className="text-base text-slate-800">
                      {currentLesson.activity.instruction}
                    </p>
                    <div className="space-y-2">
                      {currentLesson.activity.steps.map((st, stIdx) => (
                        <div key={stIdx} className="flex items-start gap-2.5 text-base text-slate-700">
                          <CheckSquare className="w-5 h-5 text-[#8D441F] shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consejo Práctico */}
                {currentLesson.practicalTip && (
                  <div className="p-4 rounded-2xl bg-[#EAF4E8] border-2 border-[#BED6B8] text-base text-[#1E4D1A] font-semibold flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-[#2D5A27] shrink-0 mt-0.5" />
                    <span>Consejo de Oro: {currentLesson.practicalTip}</span>
                  </div>
                )}

                {/* Botones de Navegación entre Lecciones */}
                <div className="pt-6 border-t-2 border-[#DFEBDC] flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  <button
                    onClick={() => setCurrentLessonIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentLessonIndex === 0}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Lección Anterior</span>
                  </button>

                  <button
                    onClick={() => handleToggleLesson(currentLesson.id, selectedModule.id)}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      completedLessonIds.includes(currentLesson.id)
                        ? 'bg-[#EAF4E8] text-[#1E4D1A] border-2 border-[#BED6B8]'
                        : 'bg-[#2D5A27] text-white hover:bg-[#1F3D1B]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedLessonIds.includes(currentLesson.id)
                        ? 'Lección Completada ✓'
                        : 'Marcar como Completada'}
                    </span>
                  </button>

                  {currentLessonIndex < selectedModule.lessons.length - 1 ? (
                    <button
                      onClick={() => setCurrentLessonIndex((prev) => prev + 1)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#1F3D1B] text-white font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Siguiente Lección</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingQuiz(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#7E56A0] hover:bg-[#684187] text-white font-bold text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Presentar Evaluación →</span>
                    </button>
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* Modal de Certificado Oficial */}
      {activeCertificateToView && (
        <CertificateModal
          certificate={activeCertificateToView}
          onClose={() => setActiveCertificateToView(null)}
        />
      )}

    </div>
  );
};
