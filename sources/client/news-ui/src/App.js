import homeApi from "apis/published/homeApi";
import { envTimeTrackingVisitorOnline } from "common/enviroments";
import { updateView } from "features/Home/homeSlice";
import DefaultLayout from "layouts/DefaultLayout/DefaultLayout";
import React, { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "routers/routers";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await homeApi.trackingVisitorOnline();
        const action = updateView(response);
        dispatch(action);

      } catch (error) {
        console.log('Failed to fetch list: ', error);
      }
    };
    fetchTracking();

    setInterval(() => {
      fetchTracking();
    }, 20000);

  }, [])

  return (
    <Router>
      <div className="news">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
