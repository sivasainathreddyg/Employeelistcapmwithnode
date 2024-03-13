using app.interactions from '../db/interactions';
@requires: 'authenticated-user'
service CatalogService {
   @odata.draft.enabled
 entity Interactions_Header as projection on interactions.Interactions_Header;
 entity org_Users as projection on interactions.org_Users;

function updateEmployee (eId :Integer,eName :String,ePhone:String(10),priority:String,criticality : Integer)returns String;

function saveEmployees(employees :String)returns String; 
 
 function deleteEmployees(employeeIds :String) returns String;

 function assertUsers() returns String;
 
 type employees{
    EMPID :Integer;
    EMPNAME: String;
    PHONE:String
 }
}


