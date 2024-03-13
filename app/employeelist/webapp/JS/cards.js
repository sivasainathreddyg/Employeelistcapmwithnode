$(document).ready(function () {
    var eButton = setInterval(() => {
        var button = document.querySelector('[id*="btnSearch"]') 
        if (button) {
            clearInterval(eButton);
            button.addEventListener("click", function () {
                var eCard = setInterval(() => {
                    if (document.getElementById("idCard1Original--ovpCardContentContainer")) {
                        clearInterval(eCard);
                        const aDataPoints = document.getElementById("idCard1Original--ovpCardContentContainer").getElementsByTagName("g");
                        Array.from(aDataPoints).forEach(el => {
                            if (el.classList.length == 0) return;
                            var sClass = el.classList;
                            if (sClass[0].toString().includes("v-datapoint") && sClass.length > 1) {
                                var oData = el['__data__']
                                 el.addEventListener("click", function () {
                                    var sGroup = oData['CUST_GRP'];
                                    const aInputs = document.getElementsByTagName("input");
                                    if (aInputs.length > 0) {
                                        Array.from(aInputs).forEach(inp => {
                                            if (inp.id.includes("CUST_GRP")) {
                                                document.getElementById(inp.id).value = "";
                                                document.getElementById(inp.id).value = sGroup;
                                                document.getElementById(inp.id).focus();
                                                var btnID = document.querySelector('[id*="btnSearch"]').id;
                                                document.getElementById(btnID).focus();
                                                sap.ui.getCore().byId(btnID).firePress()
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }, 1000)
            })
        }
    }, 1000);
})