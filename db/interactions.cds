namespace app.interactions;

type LText : String(1024);

entity Interactions_Header {
  key empID                  : Integer;
      empName                : LText;
      phone                  : LText;
      priority_code          : String;
      @UI.Hidden criticality : Integer;
}

entity org_Users {
  key userName : String;
}


entity Employee {
  key employeeId : Integer;
      name       : String;
      city       : String;

      // Define association to many Orders
      orders     : Association to many Order
                     on $self = orders.employeeId;
}

entity Order {
  key orderId    : Integer;
      employeeId : Association to Employee; // Foreign key linking to Employee entity
      orderName  : String;
      orderPrice : Decimal(10, 2);
      createdDate:Date;
      
}

entity Employeeorders {
  key employeeId : Integer;
      name       : String;
      city       : String;
      orders     : many {
        orderId    : Integer;
        orderName  : String;
        orderPrice : Decimal(10, 2)
      }

}
