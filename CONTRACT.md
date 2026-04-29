# SOFTWARE DEVELOPMENT AGREEMENT (DEVELOPMENT PHASE ONLY)

This Agreement is made between **[Client Name]** ("Client") and **[Developer Name]** ("Developer") for the development of a prototype system titled **Clear Ice POS System**.

---

## 1. Scope of Work (Development Phase Only)

The Developer agrees to design and develop a **development-stage prototype** of the Clear Ice POS System with the following core features:

### Sales Module
- Process sales transactions with product selection interface
- Support multiple payment methods (Cash, GCash, Credit)
- Automatic calculation of transaction totals
- Customer selection (registered customers or walk-in transactions)
- Transaction date and personnel tracking (Recorded By, Delivered By)

### Inventory Management Module
- Daily ice inventory tracking with beginning count, harvested quantity, and ending physical count
- Automatic variance calculation (Expected vs. Actual)
- Variance documentation with notes for shortages or overages
- Water restock tracking interface
- Ice size differentiation (28mm, 35mm)

### Container Tracking System
- Automatic borrowing container logging during sales (Gallon, Big Styro, Small Styro, Sack)
- Per-customer container borrowed ledger
- Container return processing interface
- Container status tracking (Borrowed, Returned, Lost)
- Container aging reports (days outstanding)
- Optional deposit tracking and refund processing

### Expense Logging Module
- Categorized expense recording (Auto Repair, Fuel, Utilities, Maintenance, Supplies, Salaries, Others)
- Expense date and description input
- Daily expense review and management
- Expense deduction from cash drawer tracking

### Records & Collections Module
- Customer unpaid balance display
- Payment collection interface for outstanding balances
- Partial and full payment processing
- Payment method assignment (Cash, GCash)
- Borrowed container status per customer
- Container return logging from this interface

### History & Void Module
- Date-based transaction history view
- Transaction detail display (customer, items, amounts)
- Transaction void functionality with audit trail
- Date range filtering

### Dashboard Module
- Key metrics display (Total Sales, Total Expenses, Net Profit, Outstanding Debt)
- 7-day sales trend visualization
- Top selling products display
- Real-time analytics refresh

### Z-Read (End of Day Report) Module
- Daily cash reconciliation interface
- Calculation of cash to remit based on:
  - Cash sales
  - Collections (Cash)
  - Expenses (Cash)
  - GCash and Credit tracking (separate from physical cash)
- Expected vs. Actual cash comparison
- Variance reporting (Over/Short)
- Z-Read report generation and saving

### User Account System
- User registration and login
- Role-based access (Owner/Admin, Cashier, Delivery Staff)
- PIN or password authentication
- User activity tracking

### Admin Dashboard
- System administration interface
- User management
- Product and pricing management
- System settings and configuration

---

## 2. Development Phase Only

This Agreement covers **development and prototype implementation only**.

Deployment to live servers, production environment setup, long-term maintenance, infrastructure configuration, and hosting setup are **not included** and will require a **separate agreement and additional cost**.

---

## 3. Technology Stack

The system will be developed using:

| Component | Technology |
|-----------|------------|
| Backend | PHP 8+ |
| Frontend | React 18+ |
| Database | MySQL / PostgreSQL |
| API | RESTful API |
| Authentication | Session-based auth |
| UI Framework | Tailwind CSS |

---

## 4. Payment Terms

The total project cost shall be paid in the following installments:

- **25% Downpayment** – Project initiation
- **25% Second Payment** – After initial system development milestone (User, Product, Customer modules)
- **25% Third Payment** – After core feature implementation (Sales, Inventory, Container tracking modules)
- **25% Final Payment** – Upon completion of the development phase (all modules tested and functional)

Development work will commence **only after receipt of the downpayment**.

---

## 5. Revisions and Change Requests

The project scope listed in this Agreement is fixed.

Additional revisions, feature changes, scope modifications, or requests outside the listed features requested after development has started may incur **additional costs and extended timelines**, subject to a separate agreement.

Minor bug fixes and adjustments related to the defined scope are included in the development phase at no additional cost.

---

## 6. Project Timeline

Estimated development timeline is **4 to 6 weeks from project initiation**, subject to:
- Timely feedback and approval from the Client
- Timely delivery of content/information requested from the Client
- Payment compliance according to the payment schedule

Any delays caused by Client-side factors may extend the timeline proportionally.

---

## 7. Pre-Development Requirements

Before development begins, the Client must provide:

- [ ] Confirmation of product list and pricing
- [ ] Answers to container management questions (deposits, lost container charges)
- [ ] User role requirements and access levels
- [ ] Receipt printing requirements (if needed)
- [ ] Hardware specifications (POS terminal, printer, barcode scanner)
- [ ] Any additional features or customizations beyond the standard scope

---

## 8. Deliverables

Upon completion of the development phase, the Client will receive:

1. **Fully Functional Prototype System** with all listed features
2. **System Source Code** (Clear Ice POS backend + React frontend repositories)
3. **Database Schema** and documentation
4. **Installation and Setup Guide** for local deployment
5. **User Manual** for operating the system
6. **API Documentation** for future integrations
7. **Test Report** documenting feature testing

---

## 9. Intellectual Property

Upon full payment of the development phase, the Client will receive:
- Access to the developed system prototype
- Full source code for the system
- Right to modify and use the system for their business

Ownership of the final production system (fully deployed and production-ready) will be transferred according to the terms of a future production/deployment agreement.

The Developer retains the right to use the technology, architecture, and code patterns developed for this project in other projects, provided no proprietary business logic or customizations specific to the Client are reused without permission.

---

## 10. Support and Maintenance

**This Agreement covers development only.**

After the development phase is complete:
- **Post-development support** (bug fixes, minor adjustments) may be offered at an agreed hourly rate
- **Production deployment** and ongoing maintenance will require a separate service agreement
- **System hosting** and infrastructure management are not included

---

## 11. Acceptance

By signing below, both parties agree to the terms and conditions stated in this Agreement.

---

## Client Information

Client Name: ___________________________________

Client Email: ___________________________________

Client Phone: ___________________________________

Business Name: ___________________________________

Signature: ___________________________________

Date: ___________________________________

---

## Developer Information

Developer Name: ___________________________________

Developer Email: ___________________________________

Developer Company: ___________________________________

Signature: ___________________________________

Date: ___________________________________

---

## Witness (Optional)

Witness Name: ___________________________________

Signature: ___________________________________

Date: ___________________________________

---

**Document Version:** 1.0  
**Document Date:** March 13, 2026  
**Project:** Clear Ice POS System
