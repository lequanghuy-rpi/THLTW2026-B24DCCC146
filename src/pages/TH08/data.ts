// TH08 - Ứng dụng thể dục, theo dõi sức khỏe
// Data types and mock data

export interface Workout {
  id: string;
  date: string;
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
  duration: number; // minutes
  calories: number;
  note: string;
  status: 'completed' | 'missed';
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number; // kg
  height: number; // cm
  restingHeartRate: number; // bpm
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'other';
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'active' | 'achieved' | 'cancelled';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  instructions: string;
  caloriesPerHour: number;
}

// Mock Data
export const mockWorkouts: Workout[] = [
  { id: '1', date: '2026-04-28', type: 'Cardio', duration: 45, calories: 350, note: 'Chạy bộ sáng', status: 'completed' },
  { id: '2', date: '2026-04-27', type: 'Strength', duration: 60, calories: 280, note: 'Tập gym', status: 'completed' },
  { id: '3', date: '2026-04-26', type: 'Yoga', duration: 30, calories: 120, note: 'Yoga buổi sáng', status: 'completed' },
  { id: '4', date: '2026-04-25', type: 'HIIT', duration: 25, calories: 300, note: 'Tabata', status: 'completed' },
  { id: '5', date: '2026-04-24', type: 'Cardio', duration: 40, calories: 320, note: 'Đạp xe', status: 'completed' },
  { id: '6', date: '2026-04-23', type: 'Strength', duration: 55, calories: 260, note: 'Tập ngực', status: 'missed' },
  { id: '7', date: '2026-04-22', type: 'Cardio', duration: 50, calories: 380, note: 'Bơi lội', status: 'completed' },
  { id: '8', date: '2026-04-21', type: 'Yoga', duration: 45, calories: 150, note: 'Pilates', status: 'completed' },
];

export const mockHealthMetrics: HealthMetric[] = [
  { id: '1', date: '2026-04-28', weight: 72, height: 175, restingHeartRate: 68, sleepHours: 7 },
  { id: '2', date: '2026-04-21', weight: 73, height: 175, restingHeartRate: 70, sleepHours: 6.5 },
  { id: '3', date: '2026-04-14', weight: 74, height: 175, restingHeartRate: 72, sleepHours: 7 },
  { id: '4', date: '2026-04-07', weight: 75, height: 175, restingHeartRate: 71, sleepHours: 6 },
  { id: '5', date: '2026-03-31', weight: 76, height: 175, restingHeartRate: 74, sleepHours: 6.5 },
];

export const mockGoals: Goal[] = [
  { id: '1', name: 'Giảm 5kg', type: 'weight_loss', targetValue: 5, currentValue: 3, deadline: '2026-05-30', status: 'active' },
  { id: '2', name: 'Tăng cơ bắp', type: 'muscle_gain', targetValue: 10, currentValue: 6, deadline: '2026-06-15', status: 'active' },
  { id: '3', name: 'Chạy 50km/tháng', type: 'endurance', targetValue: 50, currentValue: 45, deadline: '2026-04-30', status: 'achieved' },
  { id: '4', name: 'Tập 20 buổi/tháng', type: 'other', targetValue: 20, currentValue: 12, deadline: '2026-04-30', status: 'active' },
];

export const mockExercises: Exercise[] = [
  { id: '1', name: 'Chạy bộ', muscleGroup: 'Full Body', difficulty: 'Medium', description: 'Chạy bộ outdoors hoặc trên máy chạy bộ', instructions: '1. Khởi động 5 phút\n2. Chạy với tốc độ vừa phải 20-30 phút\n3. Hạ nhiệt 5 phút\n4. Kéo giãn cơ sau tập', caloriesPerHour: 400 },
  { id: '2', name: 'Đẩy ngực', muscleGroup: 'Chest', difficulty: 'Medium', description: 'Bài tập cơ ngực với tạ', instructions: '1. Nằm trên ghế tập, cầm tạ\n2. Hạ tạ xuống ngực\n3. Đẩy tạ lên trời\n4. Lặp lại 3 set x 12 lần', caloriesPerHour: 250 },
  { id: '3', name: 'Ngồi xổm', muscleGroup: 'Legs', difficulty: 'Easy', description: 'Bài tập chân cơ bản', instructions: '1. Đứng thẳng, chân rộng bằng vai\n2. Hạ người xuống như ngồi lên ghế\n3. Giữ thẳng lưng\n4. Đứng lên và lặp lại', caloriesPerHour: 300 },
  { id: '4', name: 'Kéo xà đơn', muscleGroup: 'Back', difficulty: 'Hard', description: 'Bài tập lưng trên', instructions: '1. Nắm thanh xà, tay rộng hơn vai\n2. Kéo người lên cao\n3. Hạ người xuống từ từ\n4. Lặp lại', caloriesPerHour: 280 },
  { id: '5', name: 'Plank', muscleGroup: 'Core', difficulty: 'Medium', description: 'Bài tập cơ core', instructions: '1. Tì vào hai khuỷu tay và ngón chân\n2. Giữ body thẳng\n3. Giữ 30-60 giây\n4. Nghỉ và lặp lại', caloriesPerHour: 200 },
  { id: '6', name: 'Nâng tạ vai', muscleGroup: 'Shoulders', difficulty: 'Easy', description: 'Bài tập vai', instructions: '1. Cầm tạ hai bên\n2. Nâng tạ lên vai\n3. Hạ tạ xuống\n4. Lặp lại', caloriesPerHour: 180 },
  { id: '7', name: 'Yoga', muscleGroup: 'Full Body', difficulty: 'Easy', description: 'Bài tập yoga cơ bản', instructions: '1. Khởi động nhẹ\n2. Thực hiện các động tác yoga\n3. Giữ mỗi động tác 30 giây\n4. Thư giãn', caloriesPerHour: 150 },
  { id: '8', name: 'Tabata', muscleGroup: 'Full Body', difficulty: 'Hard', description: 'Bài tập HIIT cường độ cao', instructions: '1. 20 giây tập hết sức\n2. 10 giây nghỉ\n3. Lặp lại 8 lần\n4. Hoàn thành 4 phút', caloriesPerHour: 600 },
  { id: '9', name: 'Gập bụng', muscleGroup: 'Core', difficulty: 'Easy', description: 'Bài tập cơ bụng', instructions: '1. Nằm ngửa, hai tay đặt sau đầu\n2. Gập người lên\n3. Hạ xuống từ từ\n4. Lặp lại', caloriesPerHour: 220 },
];

// Helper functions
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN');
};