import React, { useState } from 'react';
import {Tabs,Card,} from 'antd';
import {
  DashboardOutlined,
  HistoryOutlined,
  LineChartOutlined,
  FlagOutlined,
  BookOutlined,
} from '@ant-design/icons';
import DashboardPage from './components/DashboardPage';
import WorkoutLogPage from './components/WorkoutLogPage';
import HealthMetricsPage from './components/HealthMetricsPage';
import GoalsPage from './components/GoalsPage';
import ExerciseLibraryPage from './components/ExerciseLibraryPage';
import {
  mockWorkouts,
  mockHealthMetrics,
  mockGoals,
  mockExercises,
  Workout,
  HealthMetric,
  Goal,
  Exercise,
} from './data';

type TabKey = 'dashboard' | 'workout' | 'health' | 'goals' | 'exercises';

const { TabPane } = Tabs;

const TH08Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(mockHealthMetrics);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const handleAddWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, { ...workout, id: Date.now().toString() }]);
  };

  const handleUpdateWorkout = (workout: Workout) => {
    setWorkouts((prev) => prev.map((w) => (w.id === workout.id ? workout : w)));
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // Health Metrics CRUD
  const handleAddHealthMetric = (metric: HealthMetric) => {
    setHealthMetrics((prev) => [...prev, { ...metric, id: Date.now().toString() }]);
  };

  const handleUpdateHealthMetric = (metric: HealthMetric) => {
    setHealthMetrics((prev) => prev.map((m) => (m.id === metric.id ? metric : m)));
  };

  const handleDeleteHealthMetric = (id: string) => {
    setHealthMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddGoal = (goal: Goal) => {
    setGoals((prev) => [...prev, { ...goal, id: Date.now().toString() }]);
  };

  const handleUpdateGoal = (goal: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, { ...exercise, id: Date.now().toString() }]);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    setExercises((prev) => prev.map((e) => (e.id === exercise.id ? exercise : e)));
  };

  const handleDeleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <Card title="Ứng dụng Thể dục & Theo dõi Sức khỏe" style={{ borderRadius: 8 }}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
        size="large"
      >
        <TabPane
          tab={
            <span>
              <DashboardOutlined /> Dashboard
            </span>
          }
          key="dashboard"
        >
          <DashboardPage
            workouts={workouts}
            healthMetrics={healthMetrics}
            goals={goals}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <HistoryOutlined /> Nhật ký tập luyện
            </span>
          }
          key="workout"
        >
          <WorkoutLogPage
            workouts={workouts}
            onAdd={handleAddWorkout}
            onUpdate={handleUpdateWorkout}
            onDelete={handleDeleteWorkout}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <LineChartOutlined /> Chỉ số sức khỏe
            </span>
          }
          key="health"
        >
          <HealthMetricsPage
            metrics={healthMetrics}
            onAdd={handleAddHealthMetric}
            onUpdate={handleUpdateHealthMetric}
            onDelete={handleDeleteHealthMetric}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FlagOutlined /> Quản lý mục tiêu
            </span>
          }
          key="goals"
        >
          <GoalsPage
            goals={goals}
            onAdd={handleAddGoal}
            onUpdate={handleUpdateGoal}
            onDelete={handleDeleteGoal}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BookOutlined /> Thư viện bài tập
            </span>
          }
          key="exercises"
        >
          <ExerciseLibraryPage
            exercises={exercises}
            onAdd={handleAddExercise}
            onUpdate={handleUpdateExercise}
            onDelete={handleDeleteExercise}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TH08Page;