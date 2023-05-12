import path from 'path'
import { fileURLToPath } from 'url'
import { readdir } from 'fs/promises'

export const __dirname = path.dirname( fileURLToPath(import.meta.url) )

export const get_file_names = async (directory: string, extensions: string[] = []): Promise<string[]> => {
    let files = await readdir(directory)

    if( extensions.length ) {
        return extensions.reduce(
            (accumulator: string[], extension: string) => {
                accumulator.push(
                    ...files.filter( file => file.endsWith(extension) )
                )
                return accumulator
            },
            []
        )
    }

    return files
}