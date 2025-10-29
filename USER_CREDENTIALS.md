# 🔑 USER LOGIN CREDENTIALS

## Total Users: 18

---

## 📧 ENGINEER PLANNER (1 user)
| Email | Password | Name | Employee ID | Department |
|-------|----------|------|-------------|------------|
| planner@company.com | planner123 | John Smith | ENG-001 | Engineering |

---

## 📧 SUPERVISORS (3 users)
| Email | Password | Name | Employee ID | Department |
|-------|----------|------|-------------|------------|
| supervisor.production@company.com | supervisor123 | Sarah Johnson | SUP-P001 | Production |
| supervisor.testing@company.com | supervisor123 | Michael Rodriguez | SUP-T001 | Testing |
| supervisor.quality@company.com | supervisor123 | Jennifer Martinez | SUP-Q001 | Quality |

---

## 📧 PRODUCTION TECHNICIANS (5 users)
| Email | Password | Name | Employee ID | Department |
|-------|----------|------|-------------|------------|
| mike.davis@company.com | tech123 | Mike Davis | TECH-P001 | Production |
| sarah.wilson@company.com | tech123 | Sarah Wilson | TECH-P002 | Production |
| james.brown@company.com | tech123 | James Brown | TECH-P003 | Production |
| lisa.anderson@company.com | tech123 | Lisa Anderson | TECH-P004 | Production |
| robert.martinez@company.com | tech123 | Robert Martinez | TECH-P005 | Production |

---

## 📧 TESTING TECHNICIANS (5 users)
| Email | Password | Name | Employee ID | Department |
|-------|----------|------|-------------|------------|
| emily.chen@company.com | tech123 | Emily Chen | TECH-T001 | Testing |
| david.lee@company.com | tech123 | David Lee | TECH-T002 | Testing |
| jennifer.garcia@company.com | tech123 | Jennifer Garcia | TECH-T003 | Testing |
| michael.taylor@company.com | tech123 | Michael Taylor | TECH-T004 | Testing |
| amanda.white@company.com | tech123 | Amanda White | TECH-T005 | Testing |

---

## 📧 QUALITY TECHNICIANS (4 users)
| Email | Password | Name | Employee ID | Department |
|-------|----------|------|-------------|------------|
| christopher.harris@company.com | tech123 | Christopher Harris | TECH-Q001 | Quality |
| jessica.thompson@company.com | tech123 | Jessica Thompson | TECH-Q002 | Quality |
| daniel.moore@company.com | tech123 | Daniel Moore | TECH-Q003 | Quality |
| michelle.jackson@company.com | tech123 | Michelle Jackson | TECH-Q004 | Quality |

---

## 🚀 Quick Test Logins

```
Engineer Planner:
planner@company.com / planner123

Production Supervisor:
supervisor.production@company.com / supervisor123

Production Technician:
mike.davis@company.com / tech123

Testing Technician:
emily.chen@company.com / tech123

Quality Technician:
christopher.harris@company.com / tech123
```

---

## 📝 Password Summary
- **Engineer Planner**: `planner123`
- **All Supervisors**: `supervisor123`
- **All Technicians**: `tech123`

---

## ⚙️ Setup Instructions

1. Make sure Firebase is configured in `.env` file
2. Make sure backend server is running: `npm run dev:backend`
3. Run the setup script:
   ```bash
   cd backend
   node scripts/setupAllUsers.js
   ```
4. Start the frontend: `npm run dev:frontend`
5. Open browser to `http://localhost:3000`
6. Login with any of the credentials above

---

## 🔒 Security Note
These are development/testing credentials. In production:
- Use strong, unique passwords
- Enable 2FA
- Implement password reset flows
- Use environment variables for any default credentials
