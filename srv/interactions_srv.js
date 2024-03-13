const cds = require("@sap/cds");
const {
    response
} = require("express");

module.exports = srv => {
    srv.on("updateEmployee", async (req) => {
        var reqData = req.data;
        await cds.run(UPDATE("APP_INTERACTIONS_INTERACTIONS_HEADER", {
            EMPID: reqData.eId
        }).with({
            EMPNAME: reqData.eName,
            PHONE: reqData.ePhone,
            PRIORITY_CODE: reqData.priority,
            criticality: reqData.criticality
        })), (err, result) => {
            if (err) throw err;
            response.send(result);
        }
    })

    srv.on("saveEmployees", async (req) => {
        var reqData = JSON.parse(req.data.employees);
        await cds.run(INSERT.into("APP_INTERACTIONS_INTERACTIONS_HEADER").entries(
            reqData
        )), (err, result) => {
            if (err) throw err;
            response.send(result);
        }
    })
    srv.on("deleteEmployees", async (req) => {
        await cds.run(DELETE.from("APP_INTERACTIONS_INTERACTIONS_HEADER").where({
                EMPID: JSON.parse(req.data.employeeIds)
            })),
            (err, result) => {
                if (err) throw err;
                response.send(result);
            }
    })

    /*
    In Below Function
    *Used child_process to replicate terminal and use cf commands to get Users.
    *Only Users who are in organization will get fetched.
    */
    // srv.on("getUsers", async(_req, res) => {
    //     try{
    //         await cds.run(SELECT.from("APP_INTERACTIONS_ORG_USERS")
    //     ), (err, result) => {
    //         if (err) throw err;
    //         // response.send(result);
    //         return result;
    //     }
    //     }
    //     catch(ex){
    //         console.log(ex,"cghvhj")
    //     }
    //         // try {
    //         //     ///Emptying the json file
    //         //     // fs.writeFile('/home/user/projects/EmployeeList/app/employeelist/webapp/model/storage.json', '');
    //         //     var exec = require('child_process').exec;
    //         //     var aUsers = [];
    //         //     exec('cf orgs', (error, result) => { //To get organization Name
    //         //         if (!error) {
    //         //             var sOrganization = result.split("name")[1].toString().replace(/\n/g, '');
    //         //             exec(`cf org-users ${sOrganization} -a`, (error2, users) => { //To get all users in organization
    //         //                 if (!error2) {
    //         //                     var aOrgusers = users.split("ORG USERS")[1].toString().replace(/\n/g, '').split("(sap.ids)");
    //         //                     if (aOrgusers) {
    //         //                         Array.from(aOrgusers).forEach(u => {
    //         //                             if (u) {
    //         //                                 const obj = {
    //         //                                     "ORGANIZATION": sOrganization,
    //         //                                     "USERNAME": u.trim(),
    //         //                                 }
    //         //                                 aUsers.push(obj);
    //         //                             }
    //         //                         })
    //         //                         const obj = {
    //         //                             "ORGANIZATION": 'test',
    //         //                             "USERNAME": 'test',
    //         //                         }
    //         //                         aUsers.push(obj);
    //         //                          cds.run(INSERT.into("APP_INTERACTIONS_ORG_USERS").entries(
    //         //                             aUsers
    //         //                         )), (err, result) => {
    //         //                             if (err) throw err;
    //         //                             response.send(result);
    //         //                         }
    //         //                     }
    //         //                 }
    //         //                 //Writing Data into storage.json file
    //         //                 // fs.writeFile('/home/user/projects/EmployeeList/app/employeelist/webapp/model/storage.json', JSON.stringify(aUsers));
    //         //             })
    //         //         }
    //         //     })
    //         // } catch (ex) {
    //         //     console.log(ex)
    //         // }
    //  })

        srv.on("assertUsers", async(_req, res) => {
            await cds.run(DELETE.from("APP_INTERACTIONS_ORG_USERS")),
            (err, result) => {
                if (err) throw err;
                response.send(result);
            }
                try {
                    var exec = require('child_process').exec;
                    var aUsers = [];
                    exec('cf orgs', (error, result) => { //To get organization Name
                        if (!error) {
                            var sOrganization = result.split("name")[1].toString().replace(/\n/g, '');
                            exec(`cf org-users ${sOrganization} -a`, (error2, users) => { //To get all users in organization
                                if (!error2) {
                                    var aOrgusers = users.split("ORG USERS")[1].toString().replace(/\n/g, '').split("(sap.ids)");
                                    if (aOrgusers) {
                                        Array.from(aOrgusers).forEach(u => {
                                            if (u) {
                                                const obj = {
                                                    "USERNAME": u.trim(),
                                                }
                                                aUsers.push(obj);
                                            }
                                        })
                                         cds.run(INSERT.into("APP_INTERACTIONS_ORG_USERS").entries(
                                            aUsers
                                        )), (err, result) => {
                                            if (err) throw err;
                                            response.send(result);
                                        }
                                    }
                                }
                            })
                        }
                    })
                } catch (ex) {
                    console.log(ex)
                }
            })
}