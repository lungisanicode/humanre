
--IF DB_ID('HumanResource') IS NOT NULL
--BEGIN
--    ALTER DATABASE HumanResource SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--    DROP DATABASE HumanResource;
--END
--GO

CREATE DATABASE HumanResource;
GO

IF OBJECT_ID('LeaveRequests', 'U') IS NOT NULL DROP TABLE LeaveRequests;
IF OBJECT_ID('PublicHolidays', 'U') IS NOT NULL DROP TABLE PublicHolidays;
IF OBJECT_ID('LeaveTypes', 'U') IS NOT NULL DROP TABLE LeaveTypes;
IF OBJECT_ID('Employees', 'U') IS NOT NULL DROP TABLE Employees;
IF OBJECT_ID('Teams', 'U') IS NOT NULL DROP TABLE Teams;
GO
 
CREATE TABLE Teams (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);
GO
 
CREATE TABLE Employees (
    Id INT PRIMARY KEY, 
    FullName NVARCHAR(100) NOT NULL,
    EmailAddress NVARCHAR(150) NOT NULL,
    CellphoneNumber NVARCHAR(20) NULL,
    TeamId INT NULL,
    IsManager BIT NOT NULL DEFAULT 0,
    IsTeamLead BIT NOT NULL DEFAULT 0,
    ManagerId INT NULL,
	ManagerEmail NVARCHAR(150) NULL, 
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Employees_Teams FOREIGN KEY (TeamId) REFERENCES Teams(Id),
    CONSTRAINT FK_Employees_Manager FOREIGN KEY (ManagerId) REFERENCES Employees(Id)
);
GO
 
CREATE TABLE LeaveTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    ModifiedDate DATETIME2 DEFAULT GETDATE()
);
GO
 
CREATE TABLE LeaveRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId INT NOT NULL,
    LeaveTypeId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    NumberOfDays INT NOT NULL,
    Reason NVARCHAR(500) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    ModifiedDate DATETIME2 DEFAULT GETDATE(),
    ApprovedById INT NULL,
    ApprovalDate DATETIME2 NULL,
    RejectionReason NVARCHAR(500) NULL,
    
    CONSTRAINT FK_LeaveRequests_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(Id),
    CONSTRAINT FK_LeaveRequests_LeaveTypes FOREIGN KEY (LeaveTypeId) REFERENCES LeaveTypes(Id),
    CONSTRAINT FK_LeaveRequests_ApprovedBy FOREIGN KEY (ApprovedById) REFERENCES Employees(Id),
    CONSTRAINT CHK_EndDateAfterStartDate CHECK (EndDate >= StartDate)
);
GO
 
CREATE TABLE PublicHolidays (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    HolidayDate DATE NOT NULL,
    Year INT NOT NULL,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    ModifiedDate DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT UK_PublicHolidays_Date UNIQUE (HolidayDate)
);
GO
 
INSERT INTO Teams (Name) VALUES
('Management'),
('Development'),
('Support');
GO
 

INSERT INTO Employees (Id, FullName, EmailAddress, CellphoneNumber, TeamId, IsManager, IsTeamLead, ManagerId) VALUES

(1, 'Linda Jenkins', 'lindajenkins@acme.com', NULL, 1, 1, 0, NULL),
(2, 'Milton Coleman', 'miltoncoleman@amce.com', '+27 55 937 274', 1, 1, 1, 1),
(3, 'Colin Horton', 'colinhorton@amce.com', '+27 20 915 7545', 1, 1, 1, 1),
 

(2005, 'Ella Jefferson', 'ellajefferson@acme.com', '+27 55 979 367', 2, 0, 0, 3),
(2006, 'Earl Craig', 'earlcraig@acme.com', '+27 20 916 5608', 2, 0, 0, 3),
(2008, 'Marsha Murphy', 'marshamurphy@acme.com', '+36 55 949 891', 2, 0, 0, 3),
(2009, 'Luis Ortega', 'luisortega@acme.com', '+27 20 917 1339', 2, 0, 0, 3),
(2010, 'Faye Dennis', 'fayedennis@acme.com', NULL, 2, 0, 0, 3),
(2012, 'Amy Burns', 'amyburns@acme.com', '+27 20 914 1775', 2, 0, 0, 3),
(2013, 'Darrel Weber', 'darrelweber@acme.com', '+27 55 615 463', 2, 0, 0, 3),
 

(1005, 'Charlotte Osborne', 'charlotteosborne@acme.com', '+27 55 760 177', 3, 0, 0, 2),
(1006, 'Marie Walters', 'mariewalters@acme.com', '+27 20 918 6908', 3, 0, 0, 2),
(1008, 'Leonard Gill', 'leonardgill@acme.com', '+27 55 525 585', 3, 0, 0, 2),
(1009, 'Enrique Thomas', 'enriquethomas@acme.com', '+27 20 916 1335', 3, 0, 0, 2),
(1010, 'Omar Dunn', 'omardunn@acme.com', NULL, 3, 0, 0, 2),
(1012, 'Dewey George', 'deweygeorge@acme.com', '+27 55 260 127', 3, 0, 0, 2),
(1013, 'Rudy Lewis', 'rudylewis@acme.com', NULL, 3, 0, 0, 2),
(1015, 'Neal French', 'nealfrench@acme.com', '+27 20 919 4882', 3, 0, 0, 2);
GO
 
INSERT INTO LeaveTypes (Name, Description) VALUES
('Annual Leave', 'Paid time off work'),
('Sick Leave', 'Leave for illness or medical appointments'),
('Family Responsibility', 'Leave for family-related responsibilities'),
('Maternity Leave', 'Leave for childbirth and childcare'),
('Paternity Leave', 'Leave for new fathers'),
('Unpaid Leave', 'Leave without pay');
GO
 

INSERT INTO PublicHolidays (Name, HolidayDate, Year) VALUES
('New Year''s Day', '2025-01-01', 2025),
('Human Rights Day', '2025-03-21', 2025),
('Good Friday', '2025-04-18', 2025),
('Family Day', '2025-04-21', 2025),
('Freedom Day', '2025-04-27', 2025),
('Workers'' Day', '2025-05-01', 2025),
('Youth Day', '2025-06-16', 2025),
('National Women''s Day', '2025-08-09', 2025),
('Heritage Day', '2025-09-24', 2025),
('Day of Reconciliation', '2025-12-16', 2025),
('Christmas Day', '2025-12-25', 2025),
('Day of Goodwill', '2025-12-26', 2025);
GO
 
CREATE INDEX IX_Employees_TeamId ON Employees(TeamId);
CREATE INDEX IX_Employees_ManagerId ON Employees(ManagerId);
CREATE INDEX IX_Employees_Email ON Employees(EmailAddress);
CREATE INDEX IX_LeaveRequests_EmployeeId ON LeaveRequests(EmployeeId);
CREATE INDEX IX_LeaveRequests_Status ON LeaveRequests(Status);
CREATE INDEX IX_LeaveRequests_Dates ON LeaveRequests(StartDate, EndDate);
CREATE INDEX IX_LeaveRequests_ApprovedById ON LeaveRequests(ApprovedById);
CREATE INDEX IX_PublicHolidays_Date ON PublicHolidays(HolidayDate);
GO
 

UPDATE e SET e.ManagerEmail = m.EmailAddress FROM Employees e
LEFT JOIN Employees m ON e.ManagerId = m.Id;
GO