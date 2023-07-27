import { readdir } from "fs/promises";
import path from "path";
import { Log } from "../index.js";
import { existsSync } from "fs";

/**
 * Search for files in a directory and its subdirectories
 * @param dir Starting directory
 * @param exts File extensions to look for
 * @returns An array of file paths found
 */
export async function walkDirectory(dir: string, exts?: string[]): Promise<string[]> {
    // first check if directory exists
    if (!existsSync(dir)) {
        Log.Warn(`Directory ${dir} does not exist`, "walkDirectory");
        return [];
    }

    Log.Debug(`Walking directory ${dir}`, "walkDirectory");
    // get files of directory provided
    const dirFiles = await readdir(dir, { withFileTypes: true });
    let files: string[] = []; // array of file paths

    Log.Debug(`Found ${dirFiles.length} entries`, "walkDirectory");
    // loop through files
    for (let i = 0; i < dirFiles.length; i++) {
        const dirFile = dirFiles[i];

        // if file is a directory, recursive walk through it
        if (dirFile.isDirectory()) {
            Log.Debug(`${dir}/${dirFile.name} is directory, start recursive walk`, "walkDirectory");
            files = files.concat(await walkDirectory(`${dir}/${dirFile.name}`, exts));
        }

        // if file is a file, check if it has the correct extension
        if (dirFile.isFile()) {
            if (exts && exts.length > 0) {
                let ext = path.extname(dirFile.name);

                if (exts.includes(ext)) {
                    Log.Debug(
                        `${dir}/${dirFile.name} is file with correct extension, adding`,
                        "walkDirectory"
                    );
                    files.push(`${dir}/${dirFile.name}`);
                } else {
                    Log.Debug(
                        `${dir}/${dirFile.name} is file with wrong extension, adding`,
                        "walkDirectory"
                    );
                }
            } else {
                Log.Debug(`${dir}/${dirFile.name} is file, adding`, "walkDirectory");
                files.push(`${dir}/${dirFile.name}`);
            }
        }
    }

    return files;
}
