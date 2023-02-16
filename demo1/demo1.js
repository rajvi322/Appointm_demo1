const time = [
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
];

const startTime = document.getElementById('stime');
const endTime = document.getElementById('etime');

let html = '';

time.map((value) => {
    html = html + `<option value="${value.replace(` `, ':')}">${value}</option>`;
});

startTime.innerHTML = html;
endTime.innerHTML = html;

const getTimings = (time) => {
    let splitdate = time.split(':');
    let Hr = splitdate[0];
    let Min = splitdate[1];
    let AmPm = splitdate[2];
    return Hr + ':' + Min + ':00 ' + AmPm;
};

const checkTime = (start, End, date, existingTask) => {
    const userStartTime = new Date(start).getTime();
    console.log('-----', userStartTime)
    var z = 0;
    const userEndTime = new Date(End).getTime();
    console.log('-----', userEndTime)

    var date = new Date();
    date = date.getTime();

    if (userStartTime <= date) {
        alert('Past Appointments aren\'t Possible!');
        return false;
    }
    if (userEndTime - userStartTime <= 0) {
        alert('Please enter valid Time!');
        return false;
    }
    if (existingTask != null && existingTask.length !== 0) {
        existingTask.every((element) => {
            var localSdt = new Date(element.formatedDateStart).getTime();
            var localEdt = new Date(element.formatedDateEnd).getTime();
            for (let i = userStartTime; i <= userEndTime; i++) {
                if (i > localSdt && i < localEdt) {
                    z++;
                    alert(`The Doctor is busy at this slot`);
                    break;
                }
            }
            if (z > 0) {
                return false;
            } else {
                return true;
            }
        });
    }
    if (z > 0) {
        return false;
    } else {
        return true;
    }
};

const addApointment = (e) => {
    e.preventDefault();

    let pname = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let date = document.getElementById('date').value;
    let startTime = document.getElementById('stime').value;
    let endTime = document.getElementById('etime').value;
    let description = document.getElementById('descr').value;

    console.log('pn', pname)
    let startTimeDate = getTimings(startTime);
    let endTimeDate = getTimings(endTime);
    const splitedDate = date.split('-');

    // Feb 22 2222 12:00:00 PM
    // const fDate = splitedDate[2] + "-" + splitedDate[1] + "-" + splitedDate[0];

    console.log('*************', date)
    const formatedDateStart = `${splitedDate[1]} ${splitedDate[2]} ${splitedDate[0]} ${startTimeDate}`;
    const formatedDateEnd = `${splitedDate[1]} ${splitedDate[2]} ${splitedDate[0]} ${endTimeDate}`;
    console.log({ startTimeDate, endTimeDate });
    console.log('$$$$$$$$', formatedDateStart, formatedDateEnd)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // function isValidEmail(email) {
    //     return ;
    // }
    if (emailRegex.test(email)) {
        // The email is valid
    } else {
        return alert('Enter valid email')
    }
    if (pname == '' || email == '' || date == '' || startTime == '' || endTime == '' || description == ''
    ) {
        return alert('Please Enter all the data');
    }
    let obj = {
        name: pname,
        email: email,
        date: date,
        starttime: startTime,
        endtime: endTime,
        description: description,
        formatedDateStart: formatedDateStart,
        formatedDateEnd: formatedDateEnd,
    };

    let existingTask = JSON.parse(localStorage.getItem('task'));
    const timeStatus = checkTime(
        formatedDateStart,
        formatedDateEnd,
        date,
        existingTask
    );

    console.log('-----', { timeStatus });

    if (timeStatus == false) {
        return;
    }
    let x = [];

    // let tem;
    if (existingTask === null) {
        x.push(obj);
        localStorage.setItem('task', JSON.stringify(x));
        document.getElementById('taskForm').reset();
        showTable();
        return;
    }
    else if (existingTask && existingTask.length > 0) {
        x = [...existingTask];
        x.push(obj);
    }

    console.log('adding in local storage');
    localStorage.setItem('task', JSON.stringify(x));
    document.getElementById('taskForm').reset();
    showTable();
};

const getLocalStorageList = () => {
    return JSON.parse(localStorage.getItem('task'));
};

const showTable = () => {
    let tbody = document.getElementById('tableBody');
    let exsisTask = getLocalStorageList('task');
    let val = '';

    exsisTask = exsisTask?.sort((a, b) => {
        return new Date(a.formatedDateStart) - new Date(b.formatedDateStart);
    });

    console.log();
    let color = '';
    if (exsisTask && exsisTask.length > 0) {
        exsisTask.map((task, id) => {
            //  console.log({ date: new Date(task.formatedDateStart).getDate() });
            if (
                new Date(task.formatedDateStart) < new Date() &&
                new Date(task.formatedDateEnd) > new Date()
            ) {
                color = '#5ed67c';
            } else if (new Date(task.formatedDateStart) >= new Date()) {
                color = '#676ee6';
            } else if (new Date(task.formatedDateStart) <= new Date()) {
                color = '#808080';
            }

            console.log(color)
            val +=
                `<tr style="background-color:${color}"> 
            <td>${task.name}</td>
            <td>${task.email}</td>
            <td>${task.date}</td>
            <td>${task.starttime}</td>
            <td>${task.endtime}</td>
            <td>${task.description}</td>
          </tr>`;

        });
    }
    tbody.innerHTML = val;
};
showTable();
