CREATE TABLE Member(
    MemberID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(255) NOT NULL,
    LastName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Password NVARCHAR(200) NOT NULL,
    Token NVARCHAR(200)
);

CREATE TABLE LocationType(
    LocationTypeID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Category NVARCHAR(255)
);

CREATE TABLE Location(
    LocationID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    LocationName NVARCHAR(255) NOT NULL,
    LocationDescription NVARCHAR(255) NOT NULL,
    GoogleMapEmbed NVARCHAR(1000),
    LocationTypeID INT,
    CONSTRAINT Location_FK FOREIGN KEY(LocationTypeID) REFERENCES LocationType(LocationTypeID)
);

CREATE TABLE Report(
    ReportID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    DescWhat NVARCHAR(255) NOT NULL,
    DescWhen NVARCHAR(255) NOT NULL,
    OriginalPrice DECIMAL NOT NULL,
    DiscountAmount DECIMAL NOT NULL,
    IsLimitedTime NVARCHAR(255) NOT NULL,
        CHECK (IsLimitedTime IN ('True', 'False')),
    IsActiveDeal NVARCHAR(255) NOT NULL,
        CHECK (IsActiveDeal IN ('True', 'False')),
    MemberID INT,
    LocationID INT,
    CONSTRAINT Report_FK FOREIGN KEY(MemberID) REFERENCES Member(MemberID),
    CONSTRAINT Report_FK2 FOREIGN KEY(LocationID) REFERENCES Location(LocationID)
);
