# User Guide - Technician Task Management System

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Technician Guide](#technician-guide)
4. [Supervisor Guide](#supervisor-guide)
5. [Planner Guide](#planner-guide)
6. [Admin Guide](#admin-guide)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Logging In

1. Open your web browser
2. Navigate to the application URL
3. Enter your email and password
4. Click **"Sign In"**
5. You'll be redirected to your role-specific dashboard

### First Time Login

- Your administrator will provide your login credentials
- Change your password after first login (feature to be added)
- Familiarize yourself with your dashboard

---

## User Roles

### Technician
- Log daily tasks and work hours
- Record completed units and serial numbers
- View assigned job orders
- Track personal performance
- Report issues

### Supervisor
- Monitor all technicians
- View real-time production data
- Receive and manage alerts
- Track job order progress
- Analyze team performance

### Planner
- Create and manage job orders
- Assign technicians to jobs
- Monitor production schedules
- Track completion rates
- Generate reports

### Admin
- All supervisor and planner permissions
- Manage user accounts
- System configuration
- Full access to all features

---

## Technician Guide

### Dashboard Overview

Your dashboard shows:
- **Total Tasks**: Tasks completed this week
- **Units Completed**: Total units assembled
- **Avg Productivity**: Your units per hour rate
- **Total Hours**: Hours worked this week
- **Daily Performance Chart**: Visual breakdown of your work

### Logging a Task

1. Click **"Tasks"** in the sidebar
2. Click **"Log New Task"** button
3. Fill in the form:
   - **Job Order**: Select from dropdown
   - **Date**: Today's date (auto-filled)
   - **Start Time**: When you started
   - **End Time**: When you finished
   - **Units Completed**: Number of units
   - **Serial Numbers**: Enter serial numbers (comma-separated)
   - **Notes**: Any additional information
4. Click **"Submit"**

### Viewing Your Job Orders

1. Click **"Job Orders"** in sidebar
2. See all jobs assigned to you
3. Click on a job to see details:
   - Product information
   - Total quantity needed
   - Progress percentage
   - Due date
   - Serial number list

### Reporting an Issue

1. Go to a task
2. Click **"Report Issue"**
3. Describe the problem
4. Submit

---

## Supervisor Guide

### Dashboard Overview

Your dashboard displays:
- **Total Job Orders**: All active jobs
- **Active Technicians**: Currently working
- **Today's Tasks**: Task completion status
- **Critical Alerts**: Issues requiring attention
- **Job Order Status Chart**: Distribution by status
- **Productivity Trends**: Performance over time
- **Top Performers**: Best technicians this week

### Monitoring Technicians

1. Click **"Technicians"** in sidebar
2. View list of all technicians
3. Click on a technician to see:
   - Personal information
   - Performance metrics
   - Recent tasks
   - Assigned jobs

### Managing Alerts

1. Click **"Alerts"** in sidebar
2. View all alerts sorted by severity:
   - 🔴 **Critical**: Immediate action needed
   - 🟠 **High**: Urgent attention
   - 🟡 **Medium**: Monitor closely
   - ⚪ **Low**: Informational

3. Click on an alert to:
   - Read full details
   - Mark as read
   - Mark as resolved
   - View related job/technician

### Reviewing Job Progress

1. Go to **"Job Orders"**
2. Use filters:
   - Status (pending, in-progress, etc.)
   - Priority (low, medium, high, urgent)
   - Search by job number
3. Click on a job to see:
   - Progress percentage
   - Assigned technicians
   - Serial number completion
   - Timeline

---

## Planner Guide

### Creating a Job Order

1. Click **"Job Orders"**
2. Click **"Create New Job Order"**
3. Fill in details:
   - **Job Order Number**: Unique identifier
   - **Product Name**: What's being assembled
   - **Product Code**: Part number
   - **Total Quantity**: Number of units
   - **Priority**: Low/Medium/High/Urgent
   - **Due Date**: Deadline
   - **Assigned Technicians**: Select from list
   - **Serial Numbers**: Add all serials
   - **Estimated Hours**: Expected duration
   - **Notes**: Special instructions
4. Click **"Create"**

### Assigning Technicians

1. Open a job order
2. Click **"Manage Assignments"**
3. Select technicians from list
4. Consider:
   - Specialization match
   - Current workload
   - Shift timing
   - Performance history
5. Save changes

### Monitoring Production Schedule

1. View dashboard for overview
2. Check **Job Progress** chart
3. Look for:
   - 🔴 Delayed jobs (past due date)
   - 🟡 At-risk jobs (close to deadline)
   - 🟢 On-track jobs
4. Adjust assignments as needed

---

## Admin Guide

### Managing Users

#### Creating a New User

1. Use Postman or API to create users
2. Provide:
   - Email
   - Password
   - Name
   - Employee ID
   - Role
   - Phone number
   - Specialization
3. New user receives credentials

#### Deactivating a User

1. Go to **"Technicians"**
2. Select user
3. Click **"Deactivate"**
4. Confirm action

### System Monitoring

1. Check **Dashboard** regularly
2. Monitor:
   - Overall system health
   - Critical alerts
   - Performance trends
   - Delayed jobs
3. Take corrective actions

### Generating Reports

1. Use **Analytics** section
2. Select time period
3. Choose metrics:
   - Technician performance
   - Job completion rates
   - Productivity trends
4. Export data (feature to be added)

---

## Common Tasks

### Updating a Serial Number Status

1. Go to **Job Orders**
2. Select the job
3. Find the serial number
4. Update status:
   - ⏳ Pending → Not started
   - 🔄 In Progress → Currently working
   - ✅ Completed → Finished
   - ❌ Failed → Quality issue
5. Add notes if needed
6. Save

### Viewing Performance Metrics

**For Technicians:**
- Dashboard shows your personal metrics
- **Productivity**: Units per hour
- **Efficiency**: Actual vs estimated time
- **Total output**: Units completed

**For Supervisors:**
- View individual technician metrics
- Compare performance across team
- Identify top performers
- Spot issues early

### Searching and Filtering

**Job Orders:**
- By status
- By priority
- By assigned technician
- By product name/code
- By job number

**Tasks:**
- By technician
- By job order
- By date range
- By status

**Alerts:**
- By severity
- By type
- Read/unread
- Resolved/unresolved

---

## Troubleshooting

### Can't Log In

**Problem**: Login fails  
**Solutions**:
- Verify email and password are correct
- Check internet connection
- Clear browser cache
- Contact administrator for password reset

### Task Won't Submit

**Problem**: Task submission fails  
**Solutions**:
- Ensure all required fields are filled
- Check date/time format
- Verify job order is active
- Check network connection

### Data Not Loading

**Problem**: Dashboard shows loading forever  
**Solutions**:
- Refresh the page (F5)
- Check internet connection
- Try logging out and back in
- Clear browser cache
- Contact IT support

### Missing Job Orders

**Problem**: Expected job not visible  
**Solutions**:
- Check if you're assigned to the job
- Verify job status (might be completed)
- Use search function
- Contact your supervisor

### Performance Metrics Not Updating

**Problem**: Stats seem outdated  
**Solutions**:
- Metrics update after task completion
- Refresh the page
- Wait a few minutes for calculations
- Report to administrator if persists

---

## Best Practices

### For Technicians

✅ **Do's:**
- Log tasks immediately after completion
- Enter accurate serial numbers
- Report issues promptly
- Review your performance regularly
- Keep notes clear and concise

❌ **Don'ts:**
- Don't delay logging tasks
- Don't guess serial numbers
- Don't ignore quality issues
- Don't skip the notes field for important info

### For Supervisors

✅ **Do's:**
- Check dashboard at start of shift
- Address critical alerts immediately
- Communicate with technicians
- Review trends weekly
- Provide feedback

❌ **Don'ts:**
- Don't ignore alerts
- Don't micromanage
- Don't wait to resolve issues
- Don't forget to mark alerts as resolved

### For Planners

✅ **Do's:**
- Create realistic schedules
- Balance technician workload
- Set appropriate priorities
- Monitor progress daily
- Adjust plans when needed

❌ **Don'ts:**
- Don't overload technicians
- Don't ignore specializations
- Don't set unrealistic deadlines
- Don't forget to account for breaks

---

## Keyboard Shortcuts (Future Feature)

Coming soon:
- `Ctrl + N`: New task/job order
- `Ctrl + F`: Search
- `Ctrl + S`: Save
- `Esc`: Close modal

---

## Mobile Usage

The system is responsive and works on mobile devices:

- ✅ View dashboards
- ✅ Log tasks
- ✅ Check job orders
- ✅ Receive alerts
- ✅ View performance

**Tip**: Add to home screen for quick access.

---

## Support

### Getting Help

1. **Check this guide first**
2. **Ask your supervisor**
3. **Contact IT support**
4. **Submit a bug report** (if technical issue)

### Contact Information

- IT Support: [support@company.com]
- Supervisor: [Check internal directory]
- Emergency: [Emergency contact]

---

## Glossary

**Job Order**: A production request for a specific quantity of products  
**Serial Number**: Unique identifier for each unit  
**Productivity**: Units completed per hour  
**Efficiency**: Percentage of estimated vs actual time  
**Utilization**: Percentage of time actively working  
**Alert**: Notification of important events or issues  
**Task**: A work session logged by a technician  

---

## Version History

- **v1.0** - Initial release
- Features subject to updates

---

**Remember**: Accurate data entry helps everyone. When you log your work properly, it helps planners make better schedules, supervisors spot issues early, and everyone work more efficiently.
