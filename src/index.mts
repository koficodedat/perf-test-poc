import { program } from 'commander'
import path from 'path'
import { spawn } from 'child_process'
import { __dirname, get_file_names } from './utility.mjs'

type Options = {
    report?: boolean,
    no_tls?: boolean
}

const file_names = await get_file_names( path.resolve(__dirname, 'test-scripts'), ['.yml', '.yaml'] )

const run_test = (file_name: string, { report, no_tls }: Options = {}) => {
    return new Promise<void>(
        (resolve, reject) => {
            console.log(`################ SCENARIO ################\n ${file_name} \n################ SCENARIO ################`)

            let should_filter_results_data = true
            let report_file_name = ''

            if( report ) {
                const date = new Date()
                const month = date.getUTCMonth()
                const day = date.getUTCDay()
                const year = date.getUTCFullYear()
                const hour = date.getUTCHours()
                const minutes = date.getUTCMinutes()
                const seconds = date.getUTCSeconds()

                report_file_name = `${file_name.replace(/\.(yaml|yml)/g, '')}_${month}-${day}-${year}_${hour}-${minutes}-${seconds}`
            }

            const runner = spawn('yarn', ['runner', `${report ? `-o ${path.resolve(__dirname, 'reports', `${report_file_name}.json`)}` : ''}`,  `${no_tls ? '-k' : ''}`, `${path.resolve(__dirname, 'test-scripts')}/${file_name}`], { shell: true })

            runner.stdout.on('data', (data: string) => {
                let _data = `${data}`

                if( 
                    should_filter_results_data &&
                    (
                        _data.includes('Phase started') 
                        || _data.includes('Phase completed') 
                        || _data.includes('Summary report')
                        // || _data.includes('WARNING')
                    ) 
                ) {
                    if( _data.includes('Phase started') || _data.includes('Phase completed')  ) {
                        _data = _data.replace(/\n/g, '')
                    }

                    if( _data.includes('Summary report') ) {
                        should_filter_results_data = false
                        _data = '\n'.concat( _data.replace(/report.*/, `Report for "${file_name}"`).replace(/\n\n/, '') )
                    }
                   
                    console.log(_data)
                }
                else if( !should_filter_results_data ) {
                    if( _data.includes('Checks:') ) {
                        _data = _data.replace(/\n/, '').replace('Checks:', `--------------------------------\nChecks\n--------------------------------`)
                    }
                
                    console.log(_data)
                }
            })
            runner.stderr.on( 'data', (data) => console.error(`\n${data}`) )
            runner.on('close', (code: number) => {
                if (code === 0) resolve() 
                else reject(new Error(`${file_name} test failed`))
            })
        }
    )
}

program
    .name('api-performance-cli') // you may change the name
    .description('performance test runner based on artillery declarative configuration') 
    .version('1.0.0')

program
    .command('by-name')
    .description('run performance test(s) by name')
    .argument('<name>', 'name of test. finds files in test-scripts directory by using the starts with string search.')
    .option('-r, --report', 'writes report to a json file')
    .option('-i, --no-tls', 'turn off tls verification. not recommened in production')
    .action(async (name, { report, no_tls }) => {
        const filtered_file_names = file_names.filter( (_name: string) => _name.startsWith(name) )

        if( filtered_file_names.length ) console.log(`\n################# MATCHING FILE(S) ################\n- ${filtered_file_names.join('\n- ')}\n################# MATCHING FILE(S) ################\n`)

        for(const file_name of filtered_file_names) {
            try {
                await run_test(file_name, { report, no_tls })
            } catch(error: any) {
                console.error(`${error.message}`)
            }
        }
    })

program.parse(process.argv)