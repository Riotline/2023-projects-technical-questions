import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

type lassoableAnimal = { type: spaceAnimal, location: location};

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    // Lacks input checks
    if ("entities" in req.body) {
        for (let entity of req.body["entities"]) {
            spaceDatabase.push(entity);
        }
    }
    console.log(spaceDatabase);
    return res.sendStatus(200);
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.post('/lassoable', (req, res) => {
    let cowboy = (spaceDatabase.find((e) => e.type === "space_cowboy" 
                                         && e.metadata.name === req.body["cowboy_name"]));
    let animals = {
        space_animals: <lassoableAnimal[]>[],
    };

    if (cowboy === undefined)
        return res.sendStatus(400);

    let lassoLength = (cowboy!.metadata as spaceCowboy).lassoLength;

    spaceDatabase.filter((e) => {
        if (e.type !== "space_animal") return false;

        // Normal distance calc
        let dist = Math.abs(Math.sqrt(Math.pow(cowboy!.location.x - e.location.x, 2) + Math.pow(cowboy!.location.y - e.location.y, 2)));
        return dist <= lassoLength;
    }).forEach(e => {
        animals.space_animals.push({
            type: e.metadata as spaceAnimal,
            location: e.location
        });
    })
    
    return res.send(animals);
})

app.listen(8080);
