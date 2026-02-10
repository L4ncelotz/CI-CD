<template>
  <q-page class="bg-grey-1 relative-position overflow-hidden">
    <!-- Decorative Background Shape -->
    <div class="absolute-top bg-primary" style="height: 200px; border-radius: 0 0 50% 50% / 20px; transform: scaleX(1.1);"></div>

    <div class="container q-mx-auto relative-position q-pt-lg" style="max-width: 800px">
      <!-- Header Section -->
      <div class="row items-center q-mb-xl text-white">
        <div class="col">
          <div class="text-overline opacity-80 q-mb-none">FULLSTACK LAB</div>
          <h1 class="text-h3 text-weight-bold q-my-none" style="line-height: 1.1;">
            My Tasks <span class="text-weight-light opacity-70">2026</span>
          </h1>
          <div class="text-subtitle1 q-mt-sm opacity-90">Express + Prisma + Supabase</div>
        </div>
        <div class="col-auto">
          <q-btn
            round
            unelevated
            color="white"
            text-color="primary"
            icon="refresh"
            size="lg"
            :loading="loading"
            class="shadow-3 transition-generic"
            @click="fetchTasks"
          >
            <q-tooltip class="bg-dark text-body2">Reload Tasks</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Error Banner -->
      <transition
        appear
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
        <div v-if="errorMessage" class="q-mb-lg">
          <q-banner rounded class="bg-red-1 text-negative border-negative">
            <template v-slot:avatar>
              <q-icon name="error_outline" color="negative" />
            </template>
            <div class="text-weight-bold">{{ errorMessage }}</div>
            <div class="text-caption">Please checks connection or try again later.</div>
          </q-banner>
        </div>
      </transition>

      <!-- Content Area -->
      <div class="row q-col-gutter-md">
        <!-- Loading State -->
        <div v-if="loading" class="col-12 flex justify-center q-py-xl">
          <q-spinner-dots color="primary" size="4em" />
        </div>

        <template v-else>
          <!-- Empty State -->
          <div v-if="tasks.length === 0" class="col-12 text-center q-py-xl">
            <div class="bg-white rounded-borders q-pa-xl shadow-1 inline-block">
              <q-icon name="assignment_turned_in" size="5em" color="grey-3" class="q-mb-md" />
              <div class="text-h5 text-grey-8 text-weight-bold">All caught up!</div>
              <div class="text-body1 text-grey-6 q-mt-sm">No tasks found in the database.</div>
              <q-btn outline color="primary" label="Create New Task" class="q-mt-md" icon="add" disable />
            </div>
          </div>

          <!-- Task List -->
          <transition-group
            appear
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
          >
            <div v-for="(task, index) in tasks" :key="task.id" class="col-12" :style="{ animationDelay: `${index * 50}ms` }">
              <q-card class="task-card no-border shadow-1 hover:shadow-5 bg-white">
                <q-card-section class="q-pa-md">
                  <div class="row no-wrap items-start">
                    <div class="col-auto q-mr-md">
                      <q-avatar
                        color="blue-1"
                        text-color="primary"
                        icon="assignment"
                        size="md"
                        font-size="20px"
                      />
                    </div>
                    <div class="col">
                     <div class="row items-center justify-between">
                        <div class="text-h6 text-grey-9 text-weight-bold ellipsis">{{ task.title }}</div>
                         <q-badge color="grey-2" text-color="grey-7" :label="task.id.split('-')[0]" />
                     </div>
                      <div class="text-body2 text-grey-7 q-mt-xs" style="min-height: 40px;">
                        {{ task.description || 'No description provided.' }}
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <q-separator color="grey-2" inset />

                <q-card-section class="q-py-sm row items-center">
                  <div class="row items-center text-caption text-grey-6">
                    <q-icon name="schedule" size="14px" class="q-mr-xs" />
                    {{ formatDate(task.createdAt) }}
                  </div>
                  <q-space />
                  <q-btn flat round dense icon="more_horiz" color="grey-5" />
                </q-card-section>
              </q-card>
            </div>
          </transition-group>
        </template>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.opacity-70 { opacity: 0.7; }
.opacity-80 { opacity: 0.8; }
.opacity-90 { opacity: 0.9; }

.task-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.task-card:hover {
  transform: translateY(-4px);
}

.border-negative {
  border: 1px solid var(--q-negative);
}

.transition-generic {
    transition: all 0.3s ease;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const tasks = ref([]);
const loading = ref(false);
const errorMessage = ref('');

const fetchTasks = async () => {
  loading.value = true;
  errorMessage.value = '';

  // Simulate network delay for better UX demo (Remove in production)
  // await new Promise(r => setTimeout(r, 800));

  try {
    const res = await api.get('/tasks');
    tasks.value = res.data.data;
  } catch (err) {
    console.error('API Error:', err);
    const status = err.response ? err.response.status : 'Network Error';
    errorMessage.value = `Failed to load tasks (${status})`;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(fetchTasks);
</script>
