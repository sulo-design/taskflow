import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  Users, 
  BarChart2, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Trash2, 
  Edit, 
  ChevronRight, 
  AlertCircle, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Moon, 
  Sun,
  MoreVertical,
  Paperclip,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

// Dados Iniciais de Exemplo (Suzano / Corporativo)
const INITIAL_TASKS = [
  {
    id: 'TASK-101',
    title: 'Otimização da Linha de Celulose - Digestores',
    description: 'Análise de viabilidade para redução de insumos químicos e otimização de energia na área industrial.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Roberto Fonseca',
    assigneeAvatar: 'RF',
    dueDate: '2026-10-20',
    timeTracked: 14400, // em segundos (4h)
    isTracking: false,
    tags: ['Industrial', 'Sustentabilidade'],
    subtasks: [
      { id: 1, title: 'Mapeamento de consumo de energia', completed: true },
      { id: 2, title: 'Reunião com equipe de Engenharia', completed: true },
      { id: 3, title: 'Elaboração do relatório final', completed: false }
    ],
    comments: [
      { id: 1, author: 'Fernanda Lima', text: 'Dados de consumo do Q3 atualizados na planilha!', date: '10/10/2026 14:30' }
    ]
  },
  {
    id: 'TASK-102',
    title: 'Implementação de Painel Power BI de Frota',
    description: 'Desenvolvimento do dashboard executivo para acompanhamento de custos logísticos.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Camila Torres',
    assigneeAvatar: 'CT',
    dueDate: '2026-10-25',
    timeTracked: 3600,
    isTracking: false,
    tags: ['TI', 'Analytics'],
    subtasks: [
      { id: 1, title: 'Conexão com base SQL', completed: true },
      { id: 2, title: 'Desenho de telas', completed: false }
    ],
    comments: []
  },
  {
    id: 'TASK-103',
    title: 'Auditoria Anual de Governança ESG',
    description: 'Revisão dos processos de conformidade ambiental e emissão do relatório consolidado.',
    status: 'review',
    priority: 'urgent',
    assignee: 'Roberto Fonseca',
    assigneeAvatar: 'RF',
    dueDate: '2026-10-18',
    timeTracked: 28800,
    isTracking: false,
    tags: ['ESG', 'Auditoria'],
    subtasks: [
      { id: 1, title: 'Checklist de normas ISO', completed: true },
      { id: 2, title: 'Validação jurídica', completed: true }
    ],
    comments: [
      { id: 1, author: 'Carlos Mendes', text: 'Aguardando validação final da diretoria.', date: '12/10/2026 09:15' }
    ]
  },
  {
    id: 'TASK-104',
    title: 'Capacitação Operacional - Segurança do Trabalho',
    description: 'Treinamento das equipes de campo nas novas diretrizes de segurança da fábrica.',
    status: 'done',
    priority: 'low',
    assignee: 'Lucas Silva',
    assigneeAvatar: 'LS',
    dueDate: '2026-10-10',
    timeTracked: 18000,
    isTracking: false,
    tags: ['RH', 'Segurança'],
    subtasks: [
      { id: 1, title: 'Criação da apresentação', completed: true },
      { id: 2, title: 'Aplicação do treinamento', completed: true }
    ],
    comments: []
  }
];

const MEMBERS = [
  { name: 'Roberto Fonseca', avatar: 'RF', role: 'Gerente de Projetos' },
  { name: 'Camila Torres', avatar: 'CT', role: 'Analista BI' },
  { name: 'Carlos Mendes', avatar: 'CM', role: 'Coordenador ESG' },
  { name: 'Lucas Silva', avatar: 'LS', role: 'Especialista EHS' }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState('kanban'); // 'dashboard', 'kanban', 'gantt', 'team'
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Form de Nova Tarefa
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: 'Roberto Fonseca',
    dueDate: '',
    tags: ''
  });

  // Salva no localStorage quando altera
  useEffect(() => {
    localStorage.getItem('taskflow_tasks');
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Cronômetro para tarefas ativas
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(t => {
          if (t.isTracking) {
            return { ...t, timeTracked: t.timeTracked + 1 };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formatação de Tempo (segundos -> 00h 00m)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  // Mover Tarefa no Kanban
  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // Alternar cronômetro
  const toggleTimer = (taskId, e) => {
    e?.stopPropagation();
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, isTracking: !t.isTracking };
      }
      return { ...t, isTracking: false }; // pausa outros se houver
    }));
  };

  // Criar nova tarefa
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    const member = MEMBERS.find(m => m.name === newTask.assignee);
    const created = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee,
      assigneeAvatar: member ? member.avatar : 'RF',
      dueDate: newTask.dueDate || '2026-10-30',
      timeTracked: 0,
      isTracking: false,
      tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : ['Geral'],
      subtasks: [],
      comments: []
    };

    setTasks([created, ...tasks]);
    setIsNewTaskModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', assignee: 'Roberto Fonseca', dueDate: '', tags: '' });
  };

  // Deletar Tarefa
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
  };

  // Alternar Subtarefa
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubs = t.subtasks.map(s => 
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubs };
      }
      return t;
    }));
  };

  // Filtragem de tarefas
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || t.assignee === filterAssignee;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Estatísticas do Dashboard
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    totalHours: formatTime(tasks.reduce((acc, curr) => acc + curr.timeTracked, 0))
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
      medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
      low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
    };
    const labels = { urgent: 'Urgente', high: 'Alta', medium: 'Média', low: 'Baixa' };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans transition-colors duration-200`}>
      {/* Header Superior */}
      <header className={`border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md shadow-emerald-600/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none flex items-center gap-2">
              TaskFlow <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:text-emerald-300">Suzano Pro</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gerenciamento Integrado de Projetos & Processos</p>
          </div>
        </div>

        {/* Busca e Ações Rápidas */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar tarefas, ID ou palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            title="Alternar Tema"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Barra Lateral de Navegação */}
        <aside className={`w-64 min-h-[calc(100vh-73px)] border-r ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} p-4 hidden lg:block`}>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'kanban' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Quadro Kanban
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Visão Executiva / Dashboard
            </button>

            <button
              onClick={() => setActiveTab('gantt')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'gantt' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" /> Cronograma / Prazos
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'team' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" /> Equipe & Carga de Trabalho
            </button>
          </nav>

          <hr className={`my-6 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`} />

          {/* Filtros da Barra Lateral */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filtros Rápidos</h3>
            
            <div>
              <label className="text-xs text-slate-500 block mb-1">Prioridade</label>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`w-full text-xs rounded-lg p-2 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              >
                <option value="all">Todas as Prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Responsável</label>
              <select 
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className={`w-full text-xs rounded-lg p-2 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              >
                <option value="all">Todos os Membros</option>
                {MEMBERS.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 overflow-x-auto">
          {/* TAB 1: KANBAN */}
          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {[
                { id: 'todo', title: 'A Fazer', color: 'border-slate-400', count: filteredTasks.filter(t => t.status === 'todo').length },
                { id: 'in_progress', title: 'Em Andamento', color: 'border-blue-500', count: filteredTasks.filter(t => t.status === 'in_progress').length },
                { id: 'review', title: 'Em Revisão', color: 'border-amber-500', count: filteredTasks.filter(t => t.status === 'review').length },
                { id: 'done', title: 'Concluído', color: 'border-emerald-500', count: filteredTasks.filter(t => t.status === 'done').length }
              ].map(column => (
                <div key={column.id} className={`rounded-xl p-4 border-t-4 ${column.color} ${darkMode ? 'bg-slate-800/60 border-x-slate-700 border-b-slate-700' : 'bg-slate-100 border-x-slate-200 border-b-slate-200'} border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-sm flex items-center gap-2">
                      {column.title}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                        {column.count}
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-3 min-h-[500px]">
                    {filteredTasks.filter(t => t.status === column.id).map(task => (
                      <div 
                        key={task.id}
                        onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                        className={`p-4 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer group ${
                          darkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{task.id}</span>
                          {getPriorityBadge(task.priority)}
                        </div>

                        <h3 className="font-medium text-sm mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {task.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map(tag => (
                            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Barra de Progresso de Subtarefas */}
                        {task.subtasks.length > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>Subtarefas</span>
                              <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                              <div 
                                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500">
                          {/* Timer & Prazo */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => toggleTimer(task.id, e)}
                              className={`p-1 rounded-md transition-colors ${task.isTracking ? 'bg-amber-100 text-amber-700 animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                              title={task.isTracking ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
                            >
                              {task.isTracking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                            <span className="font-mono text-[11px]">{formatTime(task.timeTracked)}</span>
                          </div>

                          {/* Avatar do Responsável */}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-sm" title={task.assignee}>
                              {task.assigneeAvatar}
                            </div>
                          </div>
                        </div>

                        {/* Mover rápido */}
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {['todo', 'in_progress', 'review', 'done'].filter(s => s !== task.status).map(statusKey => (
                            <button
                              key={statusKey}
                              onClick={(e) => { e.stopPropagation(); moveTask(task.id, statusKey); }}
                              className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 transition-colors"
                            >
                              Move p/ {statusKey === 'todo' ? 'A Fazer' : statusKey === 'in_progress' ? 'Andamento' : statusKey === 'review' ? 'Revisão' : 'Concluído'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: DASHBOARD EXECUTIVO */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Tarefas</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded-lg">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxa de Conclusão</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </h3>
                    </div>
                    <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Em Andamento</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.inProgress}</h3>
                    </div>
                    <div className="p-2 bg-amber-50 text-amber-600 dark:bg-amber-900/30 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Horas Investidas</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.totalHours}</h3>
                    </div>
                    <div className="p-2 bg-purple-50 text-purple-600 dark:bg-purple-900/30 rounded-lg">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visão de Status Visual */}
              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <h3 className="font-semibold text-base mb-4">Distribuição do Fluxo de Trabalho</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-6 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${(stats.todo / stats.total) * 100}%` }} className="bg-slate-400 h-full flex items-center justify-center text-[10px] text-white font-bold" title="A Fazer">
                    {stats.todo > 0 && `${Math.round((stats.todo / stats.total) * 100)}%`}
                  </div>
                  <div style={{ width: `${(stats.inProgress / stats.total) * 100}%` }} className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold" title="Em Andamento">
                    {stats.inProgress > 0 && `${Math.round((stats.inProgress / stats.total) * 100)}%`}
                  </div>
                  <div style={{ width: `${(stats.review / stats.total) * 100}%` }} className="bg-amber-500 h-full flex items-center justify-center text-[10px] text-white font-bold" title="Em Revisão">
                    {stats.review > 0 && `${Math.round((stats.review / stats.total) * 100)}%`}
                  </div>
                  <div style={{ width: `${(stats.completed / stats.total) * 100}%` }} className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold" title="Concluído">
                    {stats.completed > 0 && `${Math.round((stats.completed / stats.total) * 100)}%`}
                  </div>
                </div>

                <div className="flex justify-between mt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> A Fazer ({stats.todo})</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Em Andamento ({stats.inProgress})</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Em Revisão ({stats.review})</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Concluído ({stats.completed})</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GANTT / CRONOGRAMA */}
          {activeTab === 'gantt' && (
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
              <h3 className="font-semibold text-base mb-6">Cronograma de Entrega das Tarefas</h3>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 text-xs">
                    <div className="w-48 font-medium truncate">{task.title}</div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-8 rounded-lg relative flex items-center px-3">
                      <div 
                        className={`h-6 rounded-md px-2 flex items-center text-white text-[10px] font-bold shadow-sm ${
                          task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(30, Math.min(100, task.subtasks.length * 30 || 40))}%` }}
                      >
                        Entrega: {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EQUIPE */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MEMBERS.map(m => {
                const memberTasks = tasks.filter(t => t.assignee === m.name);
                const completedTasks = memberTasks.filter(t => t.status === 'done');
                return (
                  <div key={m.name} className={`p-5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm text-center`}>
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      {m.avatar}
                    </div>
                    <h3 className="font-semibold text-sm">{m.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{m.role}</p>
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-3 text-xs flex justify-around">
                      <div>
                        <span className="block font-bold">{memberTasks.length}</span>
                        <span className="text-slate-400">Atribuídas</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-600">{completedTasks.length}</span>
                        <span className="text-slate-400">Concluídas</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DETALHES DA TAREFA */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-xl border shadow-xl p-6 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-mono text-slate-400 font-bold">{selectedTask.id}</span>
                <h2 className="text-lg font-bold mt-1">{selectedTask.title}</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">{selectedTask.description}</p>

            {/* Checklist de Subtarefas */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Subtarefas</h4>
              <div className="space-y-2">
                {selectedTask.subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      checked={sub.completed} 
                      onChange={() => toggleSubtask(selectedTask.id, sub.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={sub.completed ? 'line-through text-slate-400' : ''}>{sub.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => deleteTask(selectedTask.id)}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-4 h-4" /> Excluir Tarefa
              </button>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA TAREFA */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className={`w-full max-w-md rounded-xl border shadow-xl p-6 space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <h2 className="text-base font-bold">Criar Nova Tarefa</h2>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Título</label>
              <input 
                type="text" 
                required
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ex: Otimização do processo X"
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Descrição</label>
              <textarea 
                rows="3"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detalhes sobre os objetivos da tarefa..."
                className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Prioridade</label>
                <select 
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Responsável</label>
                <select 
                  value={newTask.assignee}
                  onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                  className={`w-full p-2 text-sm rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  {MEMBERS.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Salvar Tarefa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}