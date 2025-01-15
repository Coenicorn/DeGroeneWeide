import request from "supertest"

describe("authentication api", () => {
    describe("/getAllAuthlevels", () => {
        it("returns no existing auth levels when no are present", async (done) => {
            
            request(global.ApiApp)
                .get("/api/auth/getAllAuthLevels")
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    // check if body is empty
                    console.log(res.body)
                    if (res.body.length !== 0) done(new Error("body not empty"));
                    else done();
                })
                .end();

        })
    })
})