# Salary Management System – Requirements Document

## Goal

ACME Organization currently manages salary data for approximately 10,000 employees across multiple countries using spreadsheets. This process is time-consuming, error-prone, and makes it difficult to maintain accurate salary records or generate organization-wide compensation insights.

The goal of this assessment is to build a web-based Salary Management System that provides HR Managers with a centralized platform to manage employee salary information and answer common compensation-related questions efficiently.

---

## Primary User

### HR Manager

The HR Manager should be able to

* Create and manage employee records
* Search and filter employee information
* View and update salary information
* Track salary changes over time
* Analyze compensation data across departments and countries
* Access organization-wide salary insights through a dashboard

---

## Product Decisions & Assumptions

The assessment intentionally leaves several requirements open-ended. The following decisions have been made for the MVP

### Employee Management

Employee creation and editing will be supported.

Reasoning:
The HR Manager is responsible for maintaining salary data. Supporting employee creation allows the system to manage employee records directly instead of assuming all employee data already exists.

### Salary History Tracking

Salary history tracking will be included.

Reasoning:
Salary updates without historical tracking would result in loss of important compensation information. Maintaining salary history improves auditability and enables future compensation analysis.

### Countries & Currencies

The system will support employees across multiple countries and currencies.

Reasoning:
The organization operates globally. Employee salaries will be stored in their local currency along with the employee's country.

Currency conversion and exchange-rate management are intentionally excluded from the MVP to avoid introducing unnecessary financial complexity.

---

## Scope

The first version focuses on salary management and compensation analytics for an organization containing approximately 10,000 employees.

### Employee Management

* Create employee records
* View employee information
* Update employee details
* Search employees by name or employee ID
* Filter employees by department and country

### Salary Management

* View salary details
* Update employee salaries
* Store salary currency information
* Maintain salary history records
* View employee salary history

### Analytics Dashboard

The dashboard should help HR Managers answer questions about how the organization pays employees.

Key insights include:

* Total employees
* Total payroll expenditure
* Average salary by department
* Average salary by country
* Highest paid employees
* Lowest paid employees
* Employee distribution by department
* Employee distribution by country
* Payroll expenditure by department

### Data Seeding

* Seed the database with 10,000 employee records
* Generate realistic employee data including:

  * Name
  * Department
  * Designation
  * Country
  * Currency
  * Salary
  * Joining Date

---

## Deliberately Out of Scope

The following capabilities are intentionally excluded from the MVP:

### Payroll Processing

* Salary disbursement
* Payslip generation
* Tax calculations
* PF, deductions, bonuses, and benefits
* Bank integrations

Reasoning:
The objective is salary management and analytics, not payroll execution.

### Data Import / Export

* Excel import
* CSV import
* Excel export
* CSV export

Reasoning:
The assessment focuses on salary management workflows. Import/export functionality can be added in future iterations.

### Access Control

* Role-based access control
* Multiple user types
* Approval workflows

Reasoning:
The MVP assumes a single HR Manager user.

### Additional HR Features

* Employee self-service portal
* Performance reviews
* Promotion workflows
* Benefits management
* Multi organization support
* AI chatbot support

---

## Success Criteria

The solution will be considered successful if:

* HR Managers can create and manage employee records efficiently
* Salary updates are accurately recorded
* Salary history is maintained correctly
* Compensation insights can be generated from the employee dataset
* Multicountry salary data can be managed effectively
* The application performs reliably with 10,000 seeded employees
* The codebase is easy to maintain, test, and extend

---

## Future Enhancements

Potential future improvements include:

* Excel/CSV import and export
* Currency conversion support
* Authentication and role based access control
* Payroll processing workflows
* Advanced compensation trend analysis
* Audit logs and approval workflows
* Benchmarking and compensation planning tools
