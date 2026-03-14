<style scoped>
.daily-summary {
  padding: 20px;
}
.calendar {
  margin-bottom: 20px;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.weekday {
  text-align: center;
  font-weight: bold;
  padding: 5px;
  background: var(--darkmode-default-button-color);
  color: white;
  border-radius: 5px;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  min-height: 300px;
}
.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.day-cell.empty {
  background: transparent;
}
.day-cell button {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 0px solid var(--darkmode-default-button-color);
  border-radius: 5px;
  background: var(--darkmode-default-hover-button-color-background);
  color: white;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s;
}
.day-cell button:hover {
  background: #7a3fb8;
}
.day-cell button.selected {
  background: #462077;
  font-weight: bold;
}
.tasks-habits {
  margin-top: 20px;
}
.task {
  margin-bottom: 15px;
  padding: 15px;
  border: 0px solid #ddd;
  border-radius: 5px;
  background: #383838;
}
.task h3 {
  margin-top: 0;
}
.task-view {
  margin-bottom: 10px;
}
.task-view-item {
  margin-bottom: 10px;
}
.task-view-label {
  font-weight: bold;
  display: inline-block;
  min-width: 120px;
  text-align: left;
}
.task-edit {
  display: none;
}
.task.editing .task-view {
  display: none;
}
.task.editing .task-edit {
  display: block;
}
textarea {
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
}
.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.completion-message {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  text-align: center;
  animation: slideIn 0.5s ease-in-out;
}
.completion-message h2 {
  margin: 0 0 10px 0;
  font-size: 1.8em;
}
.completion-message p {
  margin: 10px 0;
  font-size: 1.1em;
  line-height: 1.6;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<template>
    
    <Notifier ref="notifier"></Notifier>

  <div class="daily-summary">
    <h1>Resumo Diário</h1>

    <!-- Calendar Section -->
    <div class="calendar">
      <div class="date-selection" style="margin-bottom: 20px;">
        <label for="month-select">Mês:</label>
        <select id="month-select" v-model="selectedMonth" class="smallSelect" style="display: inline;">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.name }}
          </option>
        </select>

        <label for="year-select" style="margin-left: 10px;">Ano:</label>
        <select id="year-select" v-model="selectedYear" class="smallSelect" style="display: inline;">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <button type="button" @click="montaMes()" class="btn ml-10">Confirmar</button>
      </div>
      <div style="max-width: 500px;">
        <h2>Dias do Mês</h2>
        <div class="weekdays">
          <div class="weekday" v-for="weekday in weekdayNames" :key="weekday">
            {{ weekday }}
          </div>
        </div>
        <div class="days">
          <div v-for="(day, index) in calendarGrid" :key="index" class="day-cell" :class="{ empty: !day }">
            <button 
              v-if="day"
              @click="selectDay(day)"
              :class="{ selected: day === selectedDay }">
              {{ day.dia }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tasks and Habits Section -->
     
    <InlineLoader
        :textoAguarde="true"
        :busy="busyTarefasLoad"
        :center="true">
    </InlineLoader>

    <div v-if="selectedDay" class="tasks-habits">
      <h2>Tarefas e Hábitos Completados
        <InlineLoader
            :textoAguarde="false"
            :busy="busyTarefasAvaliacao"
            :center="false">
        </InlineLoader>
      </h2>
      <div v-for="task in completedTasks" :key="task.id" class="task" :class="{ editing: editingTaskId === task.id }">
        <h3>{{ task.descricao }}</h3>
        <small style="color: #999;">{{ task.concluidaAtFormatted }}</small>
        
        <!-- View Mode -->
        <div class="task-view">
          <div v-if="task.psicologico" class="task-view-item">
            <span class="task-view-label">Sentimento:</span>
            {{ task.psicologico }}
          </div>
          <div v-if="task.pontomelhoria" class="task-view-item">
            <span class="task-view-label">Melhoria:</span>
            {{ task.pontomelhoria }}
          </div>
          <div v-if="task.nota" class="task-view-item">
            <span class="task-view-label">Nota:</span>
            {{ task.nota }}/10
          </div>
          <div v-if="!task.psicologico && !task.pontomelhoria && !task.nota" class="task-view-item">
            <em>Nenhuma avaliação registrada</em>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div class="task-edit">
          <input :disabled="busyTarefasAvaliacao" type="text" v-model="task.psicologico" placeholder="Como você se sentiu ao completar esta tarefa?">
          <input :disabled="busyTarefasAvaliacao" type="text" v-model="task.pontomelhoria" placeholder="O que daria para melhorar?">
          <label>Nota:
            <input 
              :disabled="busyTarefasAvaliacao"
              type="text" 
              v-model="task.nota" 
              @keydown="validateNota(task, $event)"
              placeholder="Digite um número inteiro de 0 a 10"
            />
          </label>
        </div>
        
        <!-- Action Buttons -->
        <div class="task-actions">
          <button 
            v-if="editingTaskId !== task.id"
            type="button" 
            class="btn btn-sm" 
            @click="startEditing(task.id)"
            :disabled="busyTarefasAvaliacao">
            Editar
          </button>
          <button 
            v-if="editingTaskId === task.id"
            type="button" 
            class="btn btn-sm" 
            @click="saveTaskSummary(task.id)"
            :disabled="busyTarefasAvaliacao">
            Salvar
            <InlineLoader
                :textoAguarde="false"
                :busy="busyTarefasAvaliacao"
                :center="false">
            </InlineLoader>
          </button>
          <button 
            v-if="editingTaskId === task.id"
            type="button" 
            class="btn btn-sm" 
            @click="cancelEditing(task.id)"
            :disabled="busyTarefasAvaliacao">
            Cancelar
          </button>
        </div>
      </div>

      <!-- Habits realizations -->
      <InlineLoader
          :textoAguarde="true"
          :busy="busyHabitosLoad"
          :center="true">
      </InlineLoader>
      <div v-if="completedHabits.length" class="tasks-habits">
        <h3>Hábitos realizados</h3>
        <div v-for="(h, index) in completedHabits" :key="h.id + '-' + h.habitoRealizado.id" class="task" :class="{ editing: editingHabitId === index }">
          <h3>{{ h.descricao }}</h3>
          <small style="color: #999;">{{ h.habitoRealizado.realizadoEmFormatted }}</small>
          
          <!-- View Mode -->
          <div class="task-view">
            <div v-if="h.habitoRealizado.psicologico" class="task-view-item">
              <span class="task-view-label">Sentimento:</span>
              {{ h.habitoRealizado.psicologico }}
            </div>
            <div v-if="h.habitoRealizado.pontomelhoria" class="task-view-item">
              <span class="task-view-label">Melhoria:</span>
              {{ h.habitoRealizado.pontomelhoria }}
            </div>
            <div v-if="h.habitoRealizado.nota !== null" class="task-view-item">
              <span class="task-view-label">Nota:</span>
              {{ h.habitoRealizado.nota }}/10
            </div>
            <div v-if="!h.habitoRealizado.psicologico && !h.habitoRealizado.pontomelhoria && h.habitoRealizado.nota === null" class="task-view-item">
              <em>Nenhuma avaliação registrada</em>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div class="task-edit">
            <input :disabled="busyHabitosAvaliacao" type="text" v-model="h.habitoRealizado.psicologico" placeholder="Como você se sentiu ao completar este hábito?">
            <input :disabled="busyHabitosAvaliacao" type="text" v-model="h.habitoRealizado.pontomelhoria" placeholder="O que daria para melhorar?">
            <label>Nota:
              <input 
                :disabled="busyHabitosAvaliacao"
                type="text" 
                v-model="h.habitoRealizado.nota" 
                @keydown="validateNota(h.habitoRealizado, $event)"
                placeholder="Digite um número inteiro de 0 a 10"
              />
            </label>
          </div>
          
          <!-- Action Buttons -->
          <div class="task-actions">
            <button 
              v-if="editingHabitId !== index"
              type="button" 
              class="btn btn-sm" 
              @click="startEditingHabit(index)"
              :disabled="busyHabitosAvaliacao">
              Editar
            </button>
            <button 
              v-if="editingHabitId === index"
              type="button" 
              class="btn btn-sm" 
              @click="saveHabitSummary(index)"
              :disabled="busyHabitosAvaliacao">
              Salvar
              <InlineLoader
                  :textoAguarde="false"
                  :busy="busyHabitosAvaliacao"
                  :center="false">
              </InlineLoader>
            </button>
            <button 
              v-if="editingHabitId === index"
              type="button" 
              class="btn btn-sm" 
              @click="cancelEditingHabit(index)"
              :disabled="busyHabitosAvaliacao">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-if="allTasksCompleted" class="completion-message">
        <h2>🎉 Parabéns!</h2>
        <p>Você completou a avaliação de todas as tarefas do dia!</p>
        <p>Obrigado por se dedicar a refletir sobre seu dia.</p>
        <p>Sua disciplina e compromisso comigo me fazem me sentir amado.</p>
      </div>

      <div class="summary">
        <!-- <h3>Média do Dia: {{ averageRating }}</h3> -->
        <!--<p>{{ motivationalMessage }}</p>-->
      </div>
    </div>
  </div>
</template>

<script>
import geradorDeMes from '../../core/geradorDeMes.js';
import DateTime from '@/core/DateTime.js'
import { HabitosStorage } from '@/core/storage/HabitosStorage.js'
import { HabitosRealizadosStorage } from '@/core/storage/HabitosRealizadosStorage.js'
import { TarefasStorage } from '@/core/storage/TarefasStorage.js'
import Request from '@/core/request.js';
import config from '@/core/config.js'
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';

export default {
  name: 'DailySummary',
  components: {
    InlineLoader,
    Notifier,
  },
  emits: ['redirectAfterLogin'],
  data() {
    return {
      daysInMonth: [],
      calendarGrid: [],
      weekdayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      selectedDay: null,
      completedTasks: [],
      completedHabits: [],
      busyTarefasLoad: false,
      busyHabitosLoad: false,
      busyTarefasAvaliacao: false,
      busyHabitosAvaliacao: false,
      editingTaskId: null,
      editingHabitId: null,
      selectedMonth: null,
      selectedYear: null,
      allTasksCompleted: false,
      months: [
        { value: 0, name: 'Janeiro' },
        { value: 1, name: 'Fevereiro' },
        { value: 2, name: 'Março' },
        { value: 3, name: 'Abril' },
        { value: 4, name: 'Maio' },
        { value: 5, name: 'Junho' },
        { value: 6, name: 'Julho' },
        { value: 7, name: 'Agosto' },
        { value: 8, name: 'Setembro' },
        { value: 9, name: 'Outubro' },
        { value: 10, name: 'Novembro' },
        { value: 11, name: 'Dezembro' },
      ],
      years: [],
    };
  },
  computed: {
    // averageRating() {
    //   if (this.completedTasks.length === 0) return 0;
    //   const total = this.completedTasks.reduce((sum, task) => sum + (task.rating || 0), 0);
    //   return (total / this.completedTasks.length).toFixed(2);
    // },
    // motivationalMessage() {
    //   const avg = this.averageRating;
    //   if (avg >= 4) return 'Parabéns! Você teve um dia incrível! Continue assim!';
    //   if (avg >= 2) return 'Bom trabalho! Sempre há espaço para melhorar!';
    //   return 'Não desista! Amanhã é um novo dia para brilhar!';
    // },
  },
  methods: {
    selectDay(day) {
      this.selectedDay = day;
      this.loadTasksForDay(day);
      this.loadHabitsForDay(day);
    },
    loadHabitsForDay(day) {
      this.busyHabitosLoad = true;
      HabitosStorage.index()
        .then(([response,data]) => {
          const selectedDate = `${day.ano}-${String(day.mes).padStart(2,'0')}-${String(day.dia).padStart(2,'0')}`;
          const filtered = [];
          data.forEach(habito => {
            if (habito.habitoRealizados && Array.isArray(habito.habitoRealizados)) {
              habito.habitoRealizados.forEach(hr => {
                
                // Convert hr.realizadoEm from UTC to the correct timezone before comparing
                let realizadoEmToCompare = hr.realizadoEm;
                if (habito.createdAt && habito.createdAt.timezone) {
                  const convertedDate = DateTime.convertUTCStringToTimezone(hr.realizadoEm, habito.createdAt.timezone);
                  realizadoEmToCompare = DateTime.formatDevDateTime(convertedDate);
                }

                if(hr.realizadoEm.startsWith('2026-03-14')) {
                  console.log('hr.realizadoEm',hr.realizadoEm)
                  console.log('realizadoEmToCompare',realizadoEmToCompare)
                }
                
                if (hr.realizadoEm && realizadoEmToCompare.startsWith(selectedDate)) {
                  // parse any evaluation JSON stored on the realization
                  try {
                    const evalJson = JSON.parse(hr.avaliacaoJson ?? '{}');
                    hr.psicologico = evalJson.psicologico ?? null;
                    hr.pontomelhoria = evalJson.pontomelhoria ?? null;
                    hr.nota = evalJson.nota ?? null;
                    let dateobject = DateTime.convertStringToDateObject(hr.realizadoEm);
                    hr.realizadoEmFormatted = DateTime.getWeekDay(dateobject) +', '+ DateTime.formatBrDateTime(dateobject);
                  } catch (e) {
                    console.warn('erro parse habitoRealizado.avaliacaoJson', e);
                  }

                  filtered.push({ ...habito, habitoRealizado: hr });
                }
              });
            }
          });
          this.completedHabits = filtered;
          this.busyHabitosLoad = false;
        })
        .catch(error => {
          this.busyHabitosLoad = false;
          this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true);
          console.error(error);
        });
    },

    loadTasksForDay(day) {
      this.busyTarefasLoad = true;
      TarefasStorage.index()
      .then(([response, data]) => {
        console.log({data});
        const selectedDate = `${day.ano}-${String(day.mes).padStart(2, '0')}-${String(day.dia).padStart(2, '0')}`;
        let taskfiltered = data.filter(task => task.situacaoDescritivo === 'concluida' && task.concluidaAt?.date?.startsWith(selectedDate))
        taskfiltered.forEach( (task) => {
          let avaliacaoJson = JSON.parse(task.avaliacaoJson ?? '{}');
          task.psicologico = avaliacaoJson.psicologico ?? null;
          task.pontomelhoria = avaliacaoJson.pontomelhoria ?? null;
          task.nota = avaliacaoJson.nota ?? null;
          let dateobject = DateTime.convertStringToDateObject(task.concluidaAt.date);
          task.concluidaAtFormatted = DateTime.getWeekDay(dateobject) +', '+ DateTime.formatBrDateTime(dateobject);
        });
        this.completedTasks = taskfiltered;
        console.log(this.completedTasks);
        this.busyTarefasLoad = false;
      })
      .catch((error) => {
        this.busyTarefasLoad = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true);
        console.error(error);
      });
    },
    validateNota(task, event) {
      const key = event.key;
      if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Tab') {
        event.preventDefault();
        return;
      }
      if (task.nota === '' || task.nota === null) {
        return;
      }
      const value = parseInt(task.nota + key, 10);
      if (isNaN(value)) {
        task.nota = '';
        event.preventDefault();
        return;
      }
      if (value < 0) {
        task.nota = '0';
        event.preventDefault();
      } else if (value > 10) {
        task.nota = '10';
        event.preventDefault();
      }
    },
    saveTaskSummary(taskId) {
      let task = this.completedTasks.filter(task => task.id === taskId);
      task = task[0];
      this.busyTarefasAvaliacao = true;
      let json = JSON.stringify({
        psicologico: task.psicologico,
        pontomelhoria: task.pontomelhoria,
        nota: task.nota,
      })
      task['avaliacaoJson'] = json;
      TarefasStorage.registraAvaliacao(task)
      .then(([response, data]) => {
        console.log({data});
        this.busyTarefasAvaliacao = false;
        this.editingTaskId = null;
        this.$refs.notifier.notify(`Avaliação registrada.`);
        this.checkAllTasksComplete();
      })
      .catch((error) => {
        this.busyTarefasAvaliacao = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true);
        console.error(error);
      });
    },
    checkAllTasksComplete() {
      if (this.completedTasks.length === 0) {
        this.allTasksCompleted = false;
        return;
      }
      const allComplete = this.completedTasks.every(task => 
        task.psicologico && 
        task.pontomelhoria && 
        task.nota !== null && 
        task.nota !== ''
      );
      this.allTasksCompleted = allComplete;
    },
    startEditing(taskId) {
      this.editingTaskId = taskId;
    },
    cancelEditing(taskId) {
      let task = this.completedTasks.find(t => t.id === taskId);
      if (task) {
        let avaliacaoJson = JSON.parse(task.avaliacaoJson ?? '{}');
        task.psicologico = avaliacaoJson.psicologico ?? null;
        task.pontomelhoria = avaliacaoJson.pontomelhoria ?? null;
        task.nota = avaliacaoJson.nota ?? null;
      }
      this.editingTaskId = null;
    },
    saveHabitSummary(habitoNumber) {
      const h = this.completedHabits[habitoNumber];
      if (!h || !h.habitoRealizado) return;
      
      this.busyHabitosAvaliacao = true;
      let json = JSON.stringify({
        psicologico: h.habitoRealizado.psicologico,
        pontomelhoria: h.habitoRealizado.pontomelhoria,
        nota: h.habitoRealizado.nota,
      })
      h.habitoRealizado['avaliacaoJson'] = json;
      HabitosRealizadosStorage.registraAvaliacao(h.habitoRealizado)
      .then(([response, data]) => {
        console.log({data});
        this.busyHabitosAvaliacao = false;
        this.editingHabitId = null;
        this.$refs.notifier.notify(`Avaliação do hábito registrada.`);
      })
      .catch((error) => {
        this.busyHabitosAvaliacao = false;
        this.$refs.notifier.notify(`Ocorreu um erro: ${error}`, true);
        console.error(error);
      });
    },
    startEditingHabit(habitoNumber) {
      this.editingHabitId = habitoNumber;
    },
    cancelEditingHabit(habitoNumber) {
      const h = this.completedHabits[habitoNumber];
      if (h && h.habitoRealizado) {
        let avaliacaoJson = JSON.parse(h.habitoRealizado.avaliacaoJson ?? '{}');
        h.habitoRealizado.psicologico = avaliacaoJson.psicologico ?? null;
        h.habitoRealizado.pontomelhoria = avaliacaoJson.pontomelhoria ?? null;
        h.habitoRealizado.nota = avaliacaoJson.nota ?? null;
      }
      this.editingHabitId = null;
    },
    montaMes(){
      this.daysInMonth = geradorDeMes.geradorDeMes(this.selectedMonth+1,this.selectedYear);
      this.construirCalendario();
      console.log('daysInMonth',this.daysInMonth);
    },
    construirCalendario() {
      // Encontra o primeiro dia do mês
      const primeiroDia = this.daysInMonth[0];
      const diaSemanaFirst = (primeiroDia.diaSemana - 1) % 7; // Converte para 0-6 (Dom-Sáb)
      
      // Cria o grid do calendário
      this.calendarGrid = [];
      
      // Adiciona células vazias antes do primeiro dia
      for (let i = 0; i < diaSemanaFirst; i++) {
        this.calendarGrid.push(null);
      }
      
      // Adiciona todos os dias do mês
      this.daysInMonth.forEach(day => {
        this.calendarGrid.push(day);
      });
    }
  },
  mounted() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    for (let i = 2000; i <= 2100; i++) {
      this.years.push(i);
    }

    this.selectedMonth = currentMonth;
    this.selectedYear = currentYear;

    this.montaMes();
  },
  watch: {
    // completedTasks: {
    //   handler(newTasks) {
    //     if (this.selectedDay) {
    //       localStorage.setItem(`tasks-${this.selectedDay}`, JSON.stringify(newTasks));
    //     }
    //   },
    //   deep: true,
    // },
  },
};
</script>
