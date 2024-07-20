// Database details
var DB_NAME = "COLLEGE-DB";
var RELATION_NAME = "PROJECT-TABLE";
var BASE_URL = "http://api.login2explore.com:5577";
var IML = "/api/iml";
var IRL = "/api/irl";
var TOKEN = "90932196|-31949215867291122|90963509";

$(document).ready(function() {
    $("#proid").focus();
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var proid = $("#proid").val();
    var jsonStr = {
        id: proid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#proname").val(record.name);
    $("#proto").val(record.to);
    $("#prodate").val(record.date);
    $("#prodeadline").val(record.deadline);
    enableFields();
}

function resetForm() {
    $("#proid").val("");
    $("#proname").val("");
    $("#proto").val("");
    $("#prodate").val("");
    $("#prodeadline").val("");
    disableFields();
    $("#proid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#proid").focus();
}

function validateData() {
    var proid, proname, proto, prodate, prodeadline;
    proid = $("#proid").val();
    proname = $("#proname").val();
    proto = $("#proto").val();
    prodate = $("#prodate").val();
    prodeadline = $("#prodeadline").val();

    if (proid === "") {
        alert("Project ID missing");
        $("#proid").focus();
        return "";
    }
    if (proname === "") {
        alert("Project Name missing");
        $("#proname").focus();
        return "";
    }
    if (proto === "") {
        alert("Assigned To missing");
        $("#proto").focus();
        return "";
    }
    if (prodate === "") {
        alert("Project Date missing");
        $("#prodate").focus();
        return "";
    }
    if (prodeadline === "") {
        alert("Project Deadline missing");
        $("#prodeadline").focus();
        return "";
    }

    var jsonStrObj = {
        Project_ID: proid,
        Project_Name: proname,
        Assigned_To: proto,
        Assignment_Date: prodate,
        Deadline: prodeadline
    };
    return JSON.stringify(jsonStrObj);
}

function enableFields() {
    $("#proname").prop("disabled", false);
    $("#proto").prop("disabled", false);
    $("#prodate").prop("disabled", false);
    $("#prodeadline").prop("disabled", false);
}

function disableFields() {
    $("#proname").prop("disabled", true);
    $("#proto").prop("disabled", true);
    $("#prodate").prop("disabled", true);
    $("#prodeadline").prop("disabled", true);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(TOKEN, DB_NAME, RELATION_NAME, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, BASE_URL, IRL);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        enableFields();
        $("#proname").focus();
    } else if (resJsonObj.status === 200) {
        $("#proid").prop("disabled", true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(TOKEN, jsonStrObj, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    alert(JSON.stringify(resJsonObj));
    resetForm();
    $("#proid").focus();
}

function updateData() {
    $("#update").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(TOKEN, jsonChg, DB_NAME, RELATION_NAME, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#proid").focus();
}

