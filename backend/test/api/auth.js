import request from "supertest"

describe("authentication api", () => {
    describe("/getAllAuthlevels", () => {
        it("responds with existing auth levels", async () => {



            request(global.ApiApp)
                .get("/api/auth/getAllAuthLevels")
                .expect(200)
                .expect("Content-Type", /json/)
                .end((err, res) => {
                    if (err) throw err;
                    // check if body is empty
                    if (res.body.length !== 0) throw new Error("body not empty");
                })

        })
    })
})