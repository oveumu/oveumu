function setupMenu(){
    let li = [...document.getElementById("mobile").getElementsByTagName("li")];
    li[0].addEventListener("click", function(){
        let setActive = li[0].classList.contains("hidden");
        li.slice(1).forEach(function(li){ li.style.display = setActive ? "flex" : "none"; });
        setActive ? li[0].classList.remove("hidden") : li[0].classList.add("hidden");
    });
}

function setupAchievements(){
    let table = document.getElementById("achievements");
    if(!table)
        return;
    [...table.getElementsByTagName("tr")].slice(1).forEach(tr => tr.remove());
    let columns = table.getElementsByTagName("tr")[0].children.length;
    fetch("data/achievements.csv")
    .then(function(r){ return r.text(); })
    .then(function(data){
        if(!data.startsWith("Namn"))
            throw "Invalid CSV";
        let rows = data.replace(/[\r]/g, "").replace(/\,/g, ";").split("\n").slice(1).map(function(r){ return r.split(";").map(function(c){ return c.trim(); }); });
        rows = sortAchievements(rows);
        for(let row of rows){
            let tr = document.createElement("tr");
            for(let i = 0;i < columns;i++){
                let td = document.createElement("td");
                td.innerText = i < row.length ? row[i].slice(0, 80) : "";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    })
    .catch(function(err){
        console.log("ERROR:", err);
        alert("Kunde inte hämta achievements :/");
    });
}

function sortAchievements(rows){
    rows.sort(function(a, b){
        let aCols = a.filter(function(c){ return c.length > 1 });
        let bCols = b.filter(function(c){ return c.length > 1 });
        // Sort first based on number of achievements
        if(bCols.length > aCols.length)
            return 1;
        else if(aCols.length > bCols.length)
            return -1;
        // Secondly by first to the top achievement
        let aTop = parseInt(a.slice(-1)) || 0;
        let bTop = parseInt(b.slice(-1)) || 0;
        if(bTop > aTop)
            return 1;
        else if(aTop > bTop)
            return -1;
        // Lastly by name
        return (a[0]||"").localeCompare((b[0]||""));
    });
    return rows;
}

function setupColors(){
    let table = document.getElementById("colors");
    if(!table)
        return;
    [...table.getElementsByTagName("tr")].slice(1).forEach(tr => tr.remove());
    let columns = table.getElementsByTagName("tr")[0].children.length;
    fetch("data/colors.csv")
    .then(function(r){ return r.text(); })
    .then(function(data){
        if(!data.startsWith("Färgkod"))
            throw "Invalid CSV";
        let rows = data.replace(/[\r]/g, "").split("\n").slice(1).map(function(r){ return r.split(";").map(function(c){ return c.trim(); }); });
        if(rows.filter(function(r){ return r.length != 4; }).length)
            throw "Invalid CSV rows";
        for(let row of rows){
            let tr = document.createElement("tr");
            for(let i = 0;i < columns;i++){
                let td = document.createElement("td");
                if(i == 0)
                    td.style.backgroundColor = row[i].match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) ? row[i] : "transparent";
                else
                    td.innerText = i < row.length ? row[i].slice(0, 200) : "";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    })
    .catch(function(err){
        console.log("ERROR:", err);
        alert("Kunde inte hämta overallfärger :/");
    });
}

setupMenu();