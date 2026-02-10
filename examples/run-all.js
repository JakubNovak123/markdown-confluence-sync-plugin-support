/**
 * Run all examples
 */
const { basicExample } = require('./basic-usage');
const { customPluginExample } = require('./custom-plugin');
const { configFileExample } = require('./with-config-file');
const { tocPluginExample } = require('./toc-plugin');

async function runAllExamples() {
  console.log('\n'.repeat(2));
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Markdown Confluence Sync - Plugin Support Examples       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    await basicExample();
    console.log(`\n${'='.repeat(60)}\n`);

    await customPluginExample();
    console.log(`\n${'='.repeat(60)}\n`);

    await configFileExample();
    console.log(`\n${'='.repeat(60)}\n`);

    await tocPluginExample();
    console.log(`\n${'='.repeat(60)}\n`);

    console.log('✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

module.exports = { runAllExamples };
