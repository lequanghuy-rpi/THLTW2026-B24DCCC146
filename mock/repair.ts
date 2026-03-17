import { Request, Response } from 'express';

const employees = [
  { id: '1', name: 'Nguyễn Văn A', maxCustomersPerDay: 5, schedule: 'Mon-Sat 9-17' },
  { id: '2', name: 'Trần Thị B', maxCustomersPerDay: 4, schedule: 'Mon-Fri 10-18' },
];

const services = [
  { id: '1', name: 'Sửa điện thoại', price: 500000, duration: 60 },
  { id: '2', name: 'Sửa máy tính', price: 800000, duration: 90 },
];

const appointments = [
  { id: '1', customerName: 'Lê Văn C', employeeId: '1', serviceId: '1', date: '2026-03-20', time: '10:00', status: 'confirmed' },
];

const ratings = [
  { id: '1', appointmentId: '1', rating: 5, comment: 'Tốt', employeeReply: 'Cảm ơn' },
];

export default {
  'GET /api/repair/employees': employees,
  'GET /api/repair/services': services,
  'GET /api/repair/appointments': appointments,
  'GET /api/repair/ratings': ratings,
  'POST /api/repair/employees': (req: Request, res: Response) => {
    const newEmp = { ...req.body, id: Date.now().toString() };
    employees.push(newEmp);
    res.json(newEmp);
  },
  'DELETE /api/repair/employees/:id': (req: Request, res: Response) => {
    const index = employees.findIndex(e => e.id === req.params.id);
    if (index !== -1) employees.splice(index, 1);
    res.json({ success: true });
  },
  'POST /api/repair/services': (req: Request, res: Response) => {
    const newServ = { ...req.body, id: Date.now().toString() };
    services.push(newServ);
    res.json(newServ);
  },
  'DELETE /api/repair/services/:id': (req: Request, res: Response) => {
    const index = services.findIndex(s => s.id === req.params.id);
    if (index !== -1) services.splice(index, 1);
    res.json({ success: true });
  },
  'POST /api/repair/appointments': (req: Request, res: Response) => {
    const newApp = { ...req.body, id: Date.now().toString(), status: 'pending' };
    appointments.push(newApp);
    res.json(newApp);
  },
  'PUT /api/repair/appointments/:id': (req: Request, res: Response) => {
    const index = appointments.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...req.body };
    }
    res.json(appointments[index]);
  },
  'POST /api/repair/ratings': (req: Request, res: Response) => {
    const newRat = { ...req.body, id: Date.now().toString() };
    ratings.push(newRat);
    res.json(newRat);
  },
};