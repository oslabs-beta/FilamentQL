// script "json:server" runs json-server. a node package that let's us make fake API calls from a fake database for quick prototyping.
--fake database is easy to modify on the fly b/c it is a json file just edit in/out --data as needed.
-- json:server will run on localhost:3000 by default
// //Set up with mongoose or postgresQL later

// dev server will run on port 4000

// Some basic CRUD operations to play around with in graphiql:

read/get data:
{
residents {
name
}
}

{
resident(id:"1") {
name
}
}

mutation { addResident(name: "Keiran Carpen", email: "keiran@gmail.com", age: 25) { id, name, email } }

mutation{ deleteResident(id:"ylqF84-") { id } }

mutation { updateResident(id:"AsqETpN", email:"kc@gmail.com") { id, name, email } }
