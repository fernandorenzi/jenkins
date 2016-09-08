import {take, put, call} from 'redux-saga/effects'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'

export default (api) => {
  // ----------
  // The Worker
  // ----------
  // This is our worker.  It does the job.
  function * worker() {
    // make the call to the api
    const response = yield call(api.getJenkinsJobs);

    // success?
    if (response.ok) {
      yield put(Actions.getJobsSuccess(response.data.jobs));
    } else {
      yield put(Actions.getJobsFailure(response.statusCode));
    }
  }


  // -----------
  // The Watcher
  // -----------
  // Make a watcher.  It's daemon.  It runs on startup and does
  // a few things:
  //
  // 1.  Goes into a loop to ensure it stays alive.
  // 2.  Listens for GETJOBS_ATTEMPT redux events
  // 3.  Unpacks the action.
  // 4.  Calls the worker (above) to do the job.
  function * watcher() {
    while (true) {
      yield take(Types.GETJOBS_ATTEMPT);
      yield call(worker)
    }
  }

  // Expose both functions.  Now, technically, we're only
  // needing to return the watcher.  If we return both, we
  // gain 2 important properties:
  //
  // 1.  We can test the worker directly without need to
  // mock the watcher taking.
  //
  // 2.  We can call the worker from other sagas which is
  // often required in some flow control cases.
  return {
    watcher,
    worker
  }
}
