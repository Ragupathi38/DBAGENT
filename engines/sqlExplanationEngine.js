function explain(sql){

    if(sql.startsWith("SELECT")){

        return "This query retrieves data from the database.";

    }

    if(sql.startsWith("INSERT")){

        return "This query inserts new data into the database.";

    }

    if(sql.startsWith("UPDATE")){

        return "This query updates existing records.";

    }

    if(sql.startsWith("DELETE")){

        return "This query removes records.";

    }

    return "SQL explanation unavailable.";

}

module.exports={

    explain

};