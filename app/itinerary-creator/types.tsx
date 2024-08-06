export interface Activity {
    name: string;
    description: string;
    image: string;
  }
  
  export interface ScheduleItem extends Activity {
    type: string;
  }
  
  export interface City {
    name: string;
    attractions: Activity[];
    tours: Activity[];
    hotels: Activity[];
  }
  
  export interface DaySchedule {
    [timeSlot: string]: ScheduleItem[];
  }
  
  export interface Schedule {
    [date: string]: DaySchedule;
  }