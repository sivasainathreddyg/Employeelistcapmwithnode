namespace app.interactions;

type LText: String(1024);
entity Interactions_Header {
    key empID: Integer;
     empName: LText;
    phone: LText;
    priority_code: String;
    @UI.Hidden criticality: Integer;
}

entity org_Users{
  key  userName : String;
}