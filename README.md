# 🧊 Clear Ice POS System

## A Complete Point-of-Sale Solution for Ice Business Operations

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Products & Pricing Structure](#products--pricing-structure)
4. [System Modules](#system-modules)
5. [Daily Operations Workflow](#daily-operations-workflow)
6. [Container Tracking System](#container-tracking-system)
7. [Cash Drawer & Z-Read](#cash-drawer--z-read)
8. [Benefits Over Current System](#benefits-over-current-system)
9. [Questions Before Development](#questions-before-development)

---

## Overview

**Clear Ice POS** is a modern Point-of-Sale system specifically designed for ice manufacturing and retail businesses. Built with **Laravel** (backend) and **React** (frontend), this system provides:

- ✅ Fast and reliable sales processing
- ✅ Real-time inventory tracking with variance calculation
- ✅ **Container tracking** (Gallons, Styro) to prevent losses
- ✅ Customer credit management
- ✅ Expense logging
- ✅ Comprehensive end-of-day cash reconciliation
- ✅ Dashboard analytics and reporting

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🛒 **Sales Module** | Process sales with multiple payment options (Cash, GCash, Credit) |
| 📦 **Inventory Management** | Track ice production, sales, and variance daily |
| 🔄 **Container Tracking** | Monitor borrowed gallons & styro per customer |
| 💰 **Collections** | Track and collect outstanding customer balances |
| 📝 **Expense Logging** | Record business expenses by category |
| 📊 **Dashboard** | View sales trends, top products, and key metrics |
| 🧾 **Z-Read Report** | End-of-day cash reconciliation |
| 📜 **Transaction History** | View and void past transactions |

---

## Products & Pricing Structure

Based on your current product lineup:

### Ice Products

| Product | Size | Container | Current Price |
|---------|------|-----------|---------------|
| Tube Ice 28mm | 1 Sack | Sack | ₱250 |
| Tube Ice 28mm | 1/2 Sack | Sack | ₱125 |
| Tube Ice 28mm | Big Styro | Styro (Returnable) | ₱240 |
| Tube Ice 28mm | Small Styro | Styro (Returnable) | ₱190 |
| Tube Ice 28mm | Bag | Plastic Bag | ₱40 |
| Tube Ice 35mm | 1 Sack | Sack | ₱250 |
| Tube Ice 35mm | 1/2 Sack | Sack | ₱125 |
| Tube Ice 35mm | Big Styro | Styro (Returnable) | ₱240 |
| Tube Ice 35mm | Small Styro | Styro (Returnable) | ₱190 |
| Tube Ice 35mm | Bag | Plastic Bag | ₱40 |
| Crushed Ice | 1 Sack | Sack | ₱280 |

### Water Products

| Product | Size | Container | Current Price |
|---------|------|-----------|---------------|
| Slim Gallon | 5 gal | Gallon (Returnable) | ₱35 |
| Bottled Water | Various | n/a | TBD |

> **Note:** Prices shown are based on attached screenshots and may be updated during system configuration.

---

## System Modules

### 1. 🛒 Sales Module

The main point-of-sale interface for processing transactions.

**Features:**
- Transaction date selection
- Customer selection (registered customer or walk-in)
- Recorder and Delivery person tracking
- Product grid with color-coded categories
- Running total calculation
- Multiple payment methods:
  - **Cash** - Full payment, added to cash drawer
  - **GCash** - Electronic payment, tracked separately
  - **Credit** - Added to customer's unpaid balance
  - **Partial** - Split between cash and credit

**Sales Flow:**
```
Select Date → Select Customer → Add Products → 
Check Containers Borrowed → Select Payment → FINALIZE
```

---

### 2. 📦 Inventory Module

Track ice inventory with daily variance calculation.

#### Daily Ice Variance Checker

| Field | Description |
|-------|-------------|
| **Count Date** | Date of inventory count |
| **Ice Size** | 28mm (Tube) or 35mm (Tube) |
| **Beginning Sacks** | Starting inventory (auto-carried from previous day) |
| **Harvested Today** | Ice produced from ice machine |
| **Actual Ending Count** | Physical count at end of day |

**Variance Calculation:**
```
Expected Count = Beginning Sacks + Harvested Today - Sold Today
Variance = Expected Count - Actual Ending Count

If Variance > 0 → SHORTAGE (possible loss, theft, or melt)
If Variance < 0 → OVERAGE (counting error or recording error)
```

#### Water Restock Tab
- Track water inventory
- Log restocking from supplier

---

### 3. 💸 Expense Module

Record all business expenses.

**Automatic Rule:**
- Any **cash advance** or **salary payment** must be automatically recorded under **Expenses** in the system.

**Categories:**
- Auto Repair
- Fuel/Diesel
- Utilities
- Ice Machine Maintenance
- Supplies
- Salaries
- Others

**Expense Flow:**
```
Select Date → Choose Category → Enter Description → Enter Amount → SAVE
```

For payroll and cash advance transactions:
```
Create Cash Advance/Salary Entry → Auto-post to Expenses → Reflect in Cash Drawer and Z-Read
```

All expenses for the selected date are displayed below for easy review.

---

### 4. 📋 Records & Collections Module

Manage customer accounts and borrowed containers.

#### A. Unpaid Balances
- View all customers with outstanding credit
- Collect partial or full payments
- Payment adds to cash drawer or GCash collections

#### B. Borrowed Containers
- View all containers currently borrowed by each customer
- Mark containers as returned
- Track aging (how long containers have been out)

---

### 5. 📜 History & Void Module

Review and manage past transactions.

**Features:**
- Select date to view all transactions
- View customer, items, and amounts
- Void transactions if needed (with audit trail)
- Filter by date range

---

### 6. 📊 Dashboard Module

At-a-glance business analytics.

**Metrics Displayed:**
- Total Sales (7 days)
- Total Expenses
- Net Profit
- Outstanding Debt (total unpaid balances)
- Sales Trend Chart (7 days)
- Top Selling Products

**Refresh Analytics** button updates all calculations.

---

### 7. 🧾 Z-Read (End of Day Report)

Daily cash reconciliation for accountability.

**Report Components:**

| Item | Description | Impact on Cash |
|------|-------------|----------------|
| Total Sales | Ice Sales + Water Sales | Display only |
| Current Cash Sales | Cash received from sales | + (Add) |
| GCash Sales | Electronic payments | Tracked separately |
| Unpaid/Credit | Credit sales | Not in cash |
| Collections (Cash) | Payments received for old debts | + (Add) |
| Collections (GCash) | Debt payments via GCash | Tracked separately |
| Less: Expenses | Cash paid out for expenses | - (Subtract) |
| **CASH TO REMIT** | Expected cash in drawer | **= Total** |

**Cash Reconciliation:**
```
Actual Cash Remitted: [Physical count entered manually]

Variance = Cash to Remit - Actual Cash Remitted
- If Positive → Cash SHORT
- If Negative → Cash OVER
```

---

## Daily Operations Workflow

### 🌅 Start of Day
1. Open POS System
2. Verify Beginning Inventory is correct (auto-carried from yesterday)
3. Enter **Harvested Today** (ice machine production)

### ☀️ Throughout the Day
1. **Process Sales**
   - Select customer (or walk-in for non-credit sales)
   - Add products to transaction
   - If customer borrows container → system tracks it
   - Select payment method
   - Finalize transaction

2. **Log Expenses** as they occur
   - Cash advances and salary payouts are auto-logged as expenses

3. **Collect Payments** from customers with balances

4. **Process Container Returns** when customers bring back gallons/styro

### 🌙 End of Day
1. **Ice Variance**
   - Do physical count of ice inventory
   - Enter actual count
   - System calculates and records variance

2. **Container Check**
   - Review containers still out
   - Follow up on overdue containers

3. **Z-Read Reconciliation**
   - Count physical cash
   - Enter actual cash remitted
   - System shows variance (over/short)
   - Save report

---

## Container Tracking System

### ❗ Solving the Missing Container Problem

One of the biggest challenges in ice and water businesses is **tracking borrowed containers** (gallons, styro boxes). Without proper tracking, containers get lost, costing the business money.

### How the System Tracks Containers

#### When Selling Products with Returnable Containers:
```
Customer buys Tube Ice 28mm - Big Styro (₱240)
         ↓
System asks: "Container Borrowed?" [Yes] [No]
         ↓
If YES → Container logged to customer's account:
   • Customer Name
   • Container Type (Big Styro)
   • Quantity (1)
   • Date Borrowed
   • Optional: Deposit collected
```

#### When Customer Returns Container:
```
Go to Records → Select Customer → Borrowed Containers
         ↓
Select the container → Mark as "Returned"
         ↓
Container removed from customer's borrowed list
If deposit was collected → Trigger refund
```

### Container Reports Available

| Report | Description |
|--------|-------------|
| **Containers Out** | Total containers currently borrowed (by type) |
| **Aging Report** | Containers borrowed for 7, 14, 30+ days |
| **By Customer** | All containers per customer |
| **Overdue List** | Containers past expected return date |
| **Lost Containers** | Mark and track lost containers |

### Container Types Tracked

| Container | Used For | Typical Deposit |
|-----------|----------|-----------------|
| Gallon (5 gal) | Bottled Water | TBD |
| Big Styro | Ice | TBD |
| Small Styro | Ice | TBD |
| Sack | Ice (If returnable) | TBD |

---

## Cash Drawer & Z-Read

### Understanding the Cash Flow

```
                    ┌─────────────────────────────┐
                    │      CASH DRAWER            │
                    └─────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ➕ ADDING TO           ➖ SUBTRACTING          📊 NOT IN CASH
   CASH DRAWER            FROM CASH              (Tracked Separately)
                              
   • Cash Sales           • Expenses (paid       • GCash Sales
   • Collections            in cash)             • Credit Sales
     (Cash)                                      • GCash Collections
```

### End of Day Formula

```
CASH TO REMIT = Cash Sales
              + Collections (Cash)
              - Expenses (Cash)

Then compare:
Actual Cash Counted vs. Cash to Remit = Variance
```

---

## Benefits Over Current System

| Aspect | Google Script POS | Clear Ice POS |
|--------|-------------------|---------------|
| **Speed** | Slow, depends on internet | Fast, optimized database |
| **Offline Mode** | Not available | Can work offline |
| **Container Tracking** | Manual/None | Automatic per-customer tracking |
| **Multi-User** | Single user | Multiple users with roles |
| **Reports** | Limited | Comprehensive dashboard |
| **Data Security** | On Google's servers | Your own server/database |
| **Customization** | Very limited | Fully customizable |
| **Mobile Friendly** | Basic | Responsive design |

---

## Questions Before Development

Please confirm the following before we begin building the system:

### 1. Container Management
- [ ] Do you collect deposits for borrowed containers?
- [ ] If yes, how much per container type?
  - Gallon: ₱_____
  - Big Styro: ₱_____
  - Small Styro: ₱_____
- [ ] What do you charge if a container is lost?
  - Gallon: ₱_____
  - Big Styro: ₱_____
  - Small Styro: ₱_____

### 2. Customer Credit
- [ ] Is there a maximum credit limit per customer?
- [ ] Do you allow credit for walk-in customers?

### 3. Business Scope
- [ ] Is this for one store only?
- [ ] Or will there be multiple branches?

### 4. Users & Access
Who will use the system?
- [ ] Owner/Admin (full access)
- [ ] Cashier (sales, collections)
- [ ] Delivery Staff (mark deliveries)
- [ ] Others: _____________

### 5. Hardware
- [ ] Do you need receipt printing? 
- [ ] If yes, what size printer? (58mm / 80mm thermal)
- [ ] Do you have a barcode scanner?

### 6. Delivery Tracking
- [ ] Do you need to track which staff delivered each order?
- [ ] Do you need delivery route planning?

### 7. Additional Features
- [ ] SMS notifications for outstanding balances?
- [ ] Customer purchase history?
- [ ] Loyalty/discount system?
- [ ] Export reports to Excel?

---

## Technical Implementation

### Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Laravel 10+ (PHP) |
| Frontend | React 18+ |
| Database | MySQL / PostgreSQL |
| API | RESTful API |
| Authentication | Laravel Sanctum |
| UI Framework | Tailwind CSS |

### Deployment Options

1. **Local Server** - Computer in your store running the system
2. **Cloud Hosted** - Accessible from anywhere via internet
3. **Hybrid** - Local with cloud backup/sync

---

## Next Steps

1. ✅ Review this document
2. ✅ Answer the questions above
3. ✅ Confirm the workflow meets your needs
4. 📞 Schedule a brief call if clarifications needed
5. 🚀 Begin development!

---

## Contact & Support

For questions about this proposal, please contact your developer.

---

*Document Version: 1.0*  
*Last Updated: March 3, 2026*
