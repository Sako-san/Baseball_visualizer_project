
let check;
let teamsMLB = {};
let teamPlayers = {};


function hideOnLoad() {
    document.getElementById('division-select1').style.visibility = 'hidden';
    document.getElementById('division-select2').style.visibility = 'hidden';
    document.getElementById('team-select1').style.visibility = 'hidden';
    document.getElementById('team-select2').style.visibility = 'hidden';
};

hideOnLoad();


const w1 = 600, h1 = 600, pad1 = 50;
const w2 = 600, h2 = 600, pad2 = 50;

const yAxisLab = h1 / 2;

const svg = d3.select("#launch_params").append("svg").attr("height", h1).attr("width", w1);
const svg2 = d3.select("#field").append("svg").attr("height", h2).attr("width", w2);

const xScale = d3.scaleLinear().range([pad1, w1 - pad1]);
const yScale = d3.scaleLinear().range([h1 - pad1, pad1]);
const xScaleField = d3.scaleLinear().range([pad2, w2 - pad2]);
const yScaleField = d3.scaleLinear().range([h2 - pad2, pad2]);

let selectedData;
let hc_x;
let hc_y;
let launch_speed;
let launch_angle;
let home_team;
let away_team;
let inning_topbot;

const myimage = svg2.append('image')
    .attr('xlink:href', 'baseball_diamond.jpg')
    .attr('width', 475)
    .attr('height', 475)
    .attr("transform", "translate(62,92)")


const dataSet = d3.csv('2019_FullSet.csv', (data) => {
    let BBIP = [];
    data.forEach((d) => {
        if (!(+d.hc_y || +d.hc_x)) { return }
        BBIP.push({
            player: d.player_name,
            inning: d.inning_topbot,
            home: d.home_team,
            away: d.away_team,
            launch_angle: +d.launch_angle,
            launch_speed: +d.launch_speed,
            hc_x: +d.hc_x,
            hc_y: +d.hc_y,
            bb_type: d.bb_type,
            event: d.events,
            date: d.game_date,
        })
    });

    for (let i = 0; i < BBIP.length; i++) {
        if (BBIP[i].inning === 'Bot') {
            teamKey = BBIP[i].home;
            playerKey = BBIP[i].player;

            if (!teamPlayers[playerKey]) {
                teamPlayers[playerKey] = [];
            }
            teamPlayers[playerKey].push(BBIP[i])

            if (!teamsMLB[teamKey]) {
                teamsMLB[teamKey] = [];
            }
            teamsMLB[teamKey][playerKey] = teamPlayers[playerKey];

        } else {
            if (BBIP[i].inning === 'Top') {
                teamKey = BBIP[i].away;
                playerKey = BBIP[i].player;

                if (!teamPlayers[playerKey]) {
                    teamPlayers[playerKey] = [];
                }
                teamPlayers[playerKey].push(BBIP[i])

                if (!teamsMLB[teamKey]) {
                    teamsMLB[teamKey] = [];
                }
                teamsMLB[teamKey][playerKey] = teamPlayers[playerKey];
            }
        }
    }

    let AL = {
        eastAL: {
            BAL: teamsMLB.BAL,
            BOS: teamsMLB.BOS,
            NYY: teamsMLB.NYY,
            TB: teamsMLB.TB,
            TOR: teamsMLB.TOR,
        },
        centralAL: {
            CWS: teamsMLB.CWS,
            CLE: teamsMLB.CLE,
            DET: teamsMLB.DET,
            KC: teamsMLB.KC,
            MIN: teamsMLB.MIN,
        },
        westAL: {
            HOU: teamsMLB.HOU,
            LAA: teamsMLB.LAA,
            OAK: teamsMLB.OAK,
            SEA: teamsMLB.SEA,
            TEX: teamsMLB.TEX,
        }
    }

    let NL = {
        eastNL: {
            ATL: teamsMLB.ATL,

            MIA: teamsMLB.MIA,
            NYM: teamsMLB.NYM,
            PHI: teamsMLB.PHI,
            WSH: teamsMLB.WSH,
        },
        centralNL: {
            CHC: teamsMLB.CHC,
            CIN: teamsMLB.CIN,
            MIL: teamsMLB.MIL,
            PIT: teamsMLB.PIT,
            STL: teamsMLB.STL,
        },
        westNL: {
            ARI: teamsMLB.ARI,
            COL: teamsMLB.COL,
            LAD: teamsMLB.LAD,
            SD: teamsMLB.SD,
            SF: teamsMLB.SF,
        }
    }

    let MLB = { AL, NL };
    let leagues = [];
    let divs;
    let roster;
    let teams = [];
    let playerEvents = [];
    let options;

    function leagueDataReducer(leagueSelect) {
        divs = Object.values(eval(leagueSelect));
        divs.forEach(div => {
            teams.push(Object.values(div)

            )
        });
        teams = teams.flat(1);

        teams.forEach(team => {
            playerEvents.push(Object.values(team))
        });

        selectedData = playerEvents.flat(2);
        return selectedData;
    };

    function divisionDataReducer(divSelect) {
        divTeams = Object.values(eval(divSelect));
        divTeams.forEach(team => {
            playerEvents.push(Object.values(team))
        });
        selectedData = playerEvents.flat(2);
        return selectedData;
    };

    function teamDataReducer(teamSelect) {
        roster = Object.values(eval(teamSelect));
        selectedData = roster.flat(1);
        return selectedData;
    };

    function mlbDataReducer(mlbSelect) {
        leagues = Object.values(MLB)
        leagues.forEach(league => {
            playerEvents = leagueDataReducer(league);
        })

        selectedData = playerEvents
        return selectedData
    }





    check = () => {
        leagueOption = document.querySelector('input[ name = "league-select" ]:checked').value;
        if (leagueOption === 'MLB') {
            mlbDataReducer("MLB")
            document.getElementById('division-select1').style.visibility = 'hidden';
            document.getElementById('team-select1').style.visibility = 'hidden';
            document.getElementById('division-select2').style.visibility = 'hidden';
            document.getElementById('team-select2').style.visibility = 'hidden';

        } else if (leagueOption === "MLB['AL']") {
            leagueDataReducer(leagueOption)
            document.getElementById('division-select1').style.visibility = 'visible';
            document.getElementById('team-select1').style.visibility = 'visible';
            document.getElementById('division-select2').style.visibility = 'hidden';
            document.getElementById('team-select2').style.visibility = 'hidden';

        } else {
            leagueDataReducer(leagueOption)
            document.getElementById('division-select2').style.visibility = 'visible';
            document.getElementById('team-select2').style.visibility = 'visible';
            document.getElementById('division-select1').style.visibility = 'hidden';
            document.getElementById('team-select1').style.visibility = 'hidden';
        }

    }

    check();

    xScale.domain(d3.extent(selectedData, (d) => { return d.launch_speed }));
    yScale.domain([d3.min(selectedData, (d) => { return d.launch_angle }), d3.max(selectedData, (d) => { return d.launch_angle })]);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h1 - pad1) + ")")
        .call(d3.axisBottom(xScale))
        .style("fill", 'white');

    svg.append("text")
        .attr("transform", "translate(" + (w1 / 2) + " ," + (h1 - 5) + ")")
        .style("text-anchor", "middle")
        .text("Exit Velocity (mph)")
        .style("fill", 'white');

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + pad1 + ", 0)")
        .call(d3.axisLeft(yScale))
        .style("fill", 'white');

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (h1 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Launch Angle (degrees)")
        .style("fill", 'white');


    // balls in play fielded location
    xScaleField.domain([-130, 130]);
    yScaleField.domain([-30, 220]);

    let t = d3.select('circles').transition();

    function percentCalc(data) {
        
        let ct1 = 0;
        let ct2 = 0;
        let ct3 = 0;
        let ct4 = 0;
        let o = 0;
        let e = 0;
        data.forEach(d => {
            if (d.event === 'single') {
                ct1 += 1;
            } else if (d.event === 'double') {
                ct2 += 1;
            } else if (d.event === 'triple') {
                ct3 += 1;
            } else if (d.event === 'home_run') {
                ct4 += 1;
            } else if (d.event === 'field_out') {
                o += 1;
            } else {
                e += 1;
            };
        });

        document.getElementById('total').innerHTML += (" " + data.length );
        document.getElementById('single').innerHTML += (" " + (100 * (ct1 / data.length)));
        document.getElementById('double').innerHTML += (" " + (100 * (ct2 / data.length)));
        document.getElementById('triple').innerHTML += (" " + (100 * (ct3 / data.length)));
        document.getElementById('homerun').innerHTML += (" " + (100 * (ct4 / data.length)) );
        document.getElementById('out').innerHTML += (" " + (100 * (o / data.length))); 
        document.getElementById('error').innerHTML += (" " + (100 * (e / data.length)));
    };

    const updateData = () => {

        document.getElementById('total').innerHTML = 'Total:'
        document.getElementById('single').innerHTML = 'Singles:'
        document.getElementById('double').innerHTML = 'Doubles:'
        document.getElementById('triple').innerHTML = 'Triples:'
        document.getElementById('homerun').innerHTML = 'Homeruns:'
        document.getElementById('out').innerHTML = 'Outs:'
        document.getElementById('error').innerHTML = 'Errors:'

        svg.selectAll("circle").remove();
        svg2.selectAll("circle").remove();

        divs;
        roster;
        teams = [];
        playerEvents = [];

        if (document.getElementById('division-select1').value || document.getElementById('team-select1').value) {
            if (document.getElementById('team-select1').value) {
                divisionDataReducer(document.getElementById('team-select1').value)
            } else {
                document.getElementById('division-select1').value
                divisionDataReducer(document.getElementById('division-select1').value)
            }
        } else if (document.getElementById('division-select2').value || document.getElementById('team-select2').value) {
            if (document.getElementById('team-select2').value) {
                divisionDataReducer(document.getElementById('team-select2').value)
            } else {
                divisionDataReducer(document.getElementById('division-select2').value)
            }
        } else {
            check();
        }

        console.log(percentCalc(selectedData));

        const checkboxes = d3.selectAll(".checkbox").nodes()
        checkboxes.forEach((box) => {
            if (box.checked) {

                svg.selectAll("circles")
                    .data(selectedData.filter((d) => { if (d.event === box.value) { return d } }))
                    .enter()
                    .append("circle")
                    .attr("class", (d) => { return d; })
                    .attr("cx", (d) => {
                        return xScale(d.launch_speed);
                    })
                    .attr("cy", (d) => {
                        return yScale(d.launch_angle);
                    })
                    .attr("r", (d) => {
                        return 3;
                    })
                    .style("fill-opacity", 0.1)
                    .attr("stroke", (d) => {
                        if (d.event === 'field_out') {
                            return "#ff0000"
                        } else if (d.event === 'single') {
                            return "#33B5FF"
                        } else if (d.event === 'double') {
                            return "#78AB46"
                        } else if (d.event === 'triple') {
                            return "#E5E500"
                        } else if (d.event === 'home_run') {
                            return "#C0C0C0"
                        } else { return "#FAFAFA" };
                    })

                svg2.selectAll("circles")
                    .data(selectedData.filter((d) => { if (d.event === box.value) { return d.event } }))
                    .enter()
                    .append("circle")
                    .attr("class", (d) => { return d.event; })
                    .attr("cx", (d) => { return xScaleField((d.hc_x - 125.42)); })
                    .attr("cy", (d) => { return yScaleField((205 - d.hc_y)); })
                    .attr("r", (d) => { return 3; })
                    .style("fill-opacity", 0.1)
                    .attr("stroke", (d) => {
                        if (d.event === 'field_out') {
                            return "#ff0000"
                        } else if (d.event === 'single') {
                            return "#33B5FF"
                        } else if (d.event === 'double') {
                            return "#78AB46"
                        } else if (d.event === 'triple') {
                            return "#E5E500"
                        } else if (d.event === 'home_run') {
                            return "#C0C0C0"
                        } else { return "#000000" };
                    })
            };
        });

    };

    // d3.selectAll(".league-select").on("change", check);
    // check();

    d3.selectAll(".checkbox").on("change", updateData);
    d3.selectAll(".league-select").on("change", updateData);
    d3.selectAll(".division-select").on("change", updateData);
    d3.selectAll(".team-select").on("change", updateData);
    check();
    updateData();

});