import { shortenUrl } from './src/app/actions.ts';

async function test() {
  const result = await shortenUrl('https://halo.me', 'hao');
  console.log('Result:', result);
}

test();
