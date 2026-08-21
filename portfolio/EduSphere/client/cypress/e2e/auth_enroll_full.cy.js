const API_BASE = Cypress.env('API_BASE') || 'http://localhost:5000/api/v1';

describe('Authenticated enroll E2E flow', () => {
  it('creates demo course, registers user, logs in, enrolls, and opens classroom', () => {
    // Ensure demo course exists
    cy.request('POST', `${API_BASE}/debug/seed-demo-course`).then((seedRes) => {
      expect(seedRes.status).to.be.oneOf([200, 201]);
      const course = seedRes.body.data.course;

      // Register a test student
      const email = `e2e_user_${Date.now()}@example.com`;
      cy.request('POST', `${API_BASE}/auth/register`, { name: 'E2E Student', email, password: 'password123' }).then((regRes) => {
        expect(regRes.status).to.eq(201);
        const token = regRes.body.token;

        // Create enrollment directly via API
        cy.request({
          method: 'POST',
          url: `${API_BASE}/enrollments/courses/${course._id}/enroll`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((enrollRes) => {
          expect(enrollRes.status).to.be.oneOf([200, 201]);

          // Ensure server returns the course when fetched by id
          cy.request('GET', `${API_BASE}/courses/${course._id}`).then((cRes) => {
            expect(cRes.status).to.eq(200);
            expect(cRes.body.data.course._id).to.eq(course._id);
          });

          // Visit classroom page with token and user set so AuthProvider hydrates immediately
          cy.visit(`/student/course/${course._id}/learn`, {
            onBeforeLoad(win) {
              win.localStorage.setItem('edusphere_token', token);
                try {
                  win.localStorage.setItem('edusphere_user', JSON.stringify(regRes.body.data.user));
                } catch (e) {}
                try {
                  win.localStorage.setItem(`edusphere_seed_course_${course._id}`, JSON.stringify(course));
                } catch (e) {}
              },
            });

            // Ensure token is present in localStorage inside the app
            cy.window().its('localStorage.edusphere_token').should('exist');

          // Classroom should show course title
          cy.contains(course.title, { timeout: 10000 }).should('exist');
        });
      });
    });
  });
});
