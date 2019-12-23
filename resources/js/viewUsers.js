document.querySelectorAll(".nav-tabs>li.nav-item").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".nav-tabs>li.nav-item>a").forEach(l => {
      l.classList.remove("active");
    });

    e.target.classList.add("active");

    const filterType = e.target.parentNode.id;
    const userRowsEL = document.querySelectorAll("tr.user-row");

    if (filterType == "all") {
      userRowsEL.forEach(row => {
        row.classList.remove("hide");
      });
    } else if (filterType == "adds") {
      userRowsEL.forEach(row => {
        if (row.classList.contains("nons")) {
          row.classList.add("hide");
        } else if (row.classList.contains("add")) {
          row.classList.remove("hide");
        }
      });
    } else if (filterType == "nons") {
      userRowsEL.forEach(row => {
        if (row.classList.contains("nons")) {
          row.classList.remove("hide");
        } else if (row.classList.contains("add")) {
          row.classList.add("hide");
        }
      });
    } 
  });
});
