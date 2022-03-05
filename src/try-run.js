// A simple clutter-free error-handling alternative to try-catch


async function tryRun(
  {
    try: inTryGeneratorFunc,
    catch: inCatchFunc
  },
  inContext
) {

  if( !inTryGeneratorFunc ) {
    throw new Error('The `tryGeneratorFunc` is required!');
  }

  let resultError = null;
  await (async () => {

    const boundedTryGeneratorFunc = inTryGeneratorFunc.bind(inContext);

    for await (let {error} of boundedTryGeneratorFunc()) {

      if( error ) {
        resultError = error;
        if( inCatchFunc ) {
          inCatchFunc(error);
        }
        break;
      }

    }

  })();

  return resultError;

}



export { tryRun };