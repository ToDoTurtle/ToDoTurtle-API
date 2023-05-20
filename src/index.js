var gcm = require('node-gcm');

const express = require('express')
const app = express()
app.use(express.json())
const port = 5000

const notifications = {}
const deadlines = {}
const serverKey = process.env.SERVER_KEY;

/*
Usage: post to /user/{id}/note/{id}/notify
Body: {
    title: "Example Title",
    description: "Lorem Ipsum",
    devices: [
        "TokenDevice1",
        "TokenDevice2",
        ...
    ],
    time: 1256L => In epoch format
}
*/
app.post('/user/:id/note/:note/notify', (req, res) => {
  const user_id = req.params.id
  const note_id = req.params.note
  const note_title = req.body.title
  const description = req.body.description
  const registrationTokens = req.body.devices
  const timeout = req.body.timeout
  const current_time = new Date().getTime() / 1000
  const delay = timeout - current_time
  if (delay <= 0) {
      res.status(401).send({message: "Trying to add a notification with malicious time" + delay})
      return
  }
  const message = new gcm.Message();
  message.addNotification({
      title: note_title,
      body: description,
      icon: 'ic_launcher'
  });
  const notifications_for_user = notifications[user_id] || [];
  if(!notifications_for_user.includes(note_id)) {
    notifications_for_user.push(note_id);
    notifications[user_id] = notifications_for_user;
  }
  setTimeout(() => {
    if (notifications[user_id] !== undefined && notifications[user_id].includes(note_id)) {
        notifications[user_id] = notifications[user_id].filter(item => item !== note_id)
        console.log("Sending notification....");
        const sender = new gcm.Sender(serverKey);
        sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
          if(err){
              console.error(err);
          } else {
              console.log(response)
          }
        });
    } else {
        console.log("Notification was already canceled");
    }
  }, delay * 1000);
  res.sendStatus(200)
})

/*
Usage: delete to user/{id}/note/{id}/notify
*/
app.delete('/user/:id/note/:note/notify', (req, res) => {
  const user_id = req.params.id
  const note_id = req.params.note
  const notifications_for_user = notifications[user_id];
  if (notifications_for_user == undefined) {
      res.sendStatus(200)
      console.log("No notifications for user, doesn't delete anything")
      return
  }
  console.log(notifications_for_user)
  if (notifications_for_user.includes(note_id)) {
      notifications[user_id] = notifications[user_id].filter(item => item !== note_id)
      console.log("Notification deleted!")
  }
  console.log(notifications)
  res.sendStatus(200)
})

/*
Usage: post to user/{id}/note/{id}/deadline
Body: {
    time: 1256L => In epoch format
}
*/
app.post('/user/:id/note/:note/deadline', (req, res) => {
  const user_id = req.params.id
  const note_id = req.params.note
  const timeout = req.body.time
  const current_time = new Date().getTime() / 1000
  console.log(current_time)
  const delay = timeout - current_time
  if (delay <= 0) {
      res.status(401).send({message: "Trying to add a deadline with malicious time" + delay})
      return
  }
  const deadlines_for_user = deadlines[user_id] || [];
  if(!deadlines_for_user.includes(note_id)) {
    deadlines_for_user.push(note_id);
    deadlines[user_id] = deadlines_for_user;
  }
  setTimeout(() => {
    if (deadlines[user_id] !== undefined && deadlines[user_id].includes(note_id)) {
        deadlines[user_id] = deadlines[user_id].filter(item => item !== note_id)
        console.log("Deleting note....");
    } else {
        console.log("Deadline was removed");
    }
  }, delay * 1000);
  res.sendStatus(200)
})


/*
Usage: delete to user/{id}/note/{id}/deadline
*/
app.delete('/user/:id/note/:note/deadline', (req, res) => {
  const user_id = req.params.id
  const note_id = req.params.note
  const deadlines_for_user = deadlines[user_id];
  if (deadlines_for_user == undefined) {
      res.sendStatus(200)
      console.log("No deadlines for user and note")
      return
  }
  if (deadlines_for_user.includes(note_id)) {
      deadlines[user_id] = deadlines[user_id].filter(item => item !== note_id)
      console.log("Deadline deleted!")
  }
  res.sendStatus(200)
})


app.get('/notifications', (req, res) => {
    res.status(200).send(notifications)
})

app.get('/deadlines', (req, res) => {
    res.status(200).send(deadlines)
})


app.listen(port, () => {
  console.log(`ToDoTurtle API listening on port ${port}`)
})
