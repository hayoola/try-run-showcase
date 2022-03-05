// Jest is beautiful!
import { tryRun } from './try-run';




describe('tryRun tests', () => {

  const kError = 'Oh no!';
  
  function successfulFunc() {

    let result = {
      error: null,
      data: 'myData1'
    }

    return result;
  }


  function failingFunc() {

    let result = {
      error: null,
      data: 'myData2'
    };

    result.error = kError;
    return result;

  }

  
  it( 'should returns null if no error ocurred inside the `tryFunc`', async () => {

    const result = await tryRun({
      
      try: async function* () {

        const result1 = successfulFunc();
        yield result1;
      }
    });

    expect(result).toBeNull();

  });

  it( 'should returns a non-null error if an error ocurred inside the `tryFunc`', async () => {
    
    
    const result = await tryRun({
      
      try: async function* () {

        const result1 = successfulFunc();
        yield result1;

        const result2 = failingFunc();
        yield result2;
        
      }
    });

    expect(result).toBe(kError);

  });


  it( 'should call the `catchFunc` on failure', async () => {

    let error = ``;

    await tryRun({

      try: async function* () {

        const result1 = successfulFunc();
        yield result1;

        const result2 = failingFunc();
        yield result2;
      },

      catch: (inError) => {

        error = inError;
      }
    });

    expect(error).toBe(kError);

  });


  it( 'should NOT call the `catchFunc` on success', async () => {

    let error = ``;
    let wasCalled = false;

    await tryRun({

      try: async function* () {

        const result1 = successfulFunc();
        yield result1;
        
      },

      catch: (inError) => {

        error = inError;
        wasCalled = true;
      }
    });

    expect(error).toBe(``);
    expect(wasCalled).toBe(false);

  });


  it( 'should have access to the `context` object as `this`', async () => {

    const context = {
      data: `123`
    };
    let data = ``;

    await tryRun({

      try: async function* () {

        const result1 = successfulFunc();
        data = this.data;
        yield result1;
      }
    }, context);

    expect(data).toBe(context.data);

  });

});