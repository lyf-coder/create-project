import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';
import shell from 'shelljs';
import clone from 'git-clone';
import jsonfile from 'jsonfile';

const log = {
    info: (str: string) => {
        console.log(chalk.blue(str));
    },
    success: (str: string) => {
        console.log(chalk.green(str));
    },
    error: (str: string) => {
        console.log(chalk.red(str));
    },
};

/**
 * template name and git url map
 */
const templateMap = new Map([
    ['Monorepo', 'https://github.com/lyf-coder/monorepo-template.git'],
    [
        `Monorepo's sub package`,
        'https://github.com/lyf-coder/monorepo-sub-package-template.git',
    ],
    [
        `single package`,
        'https://github.com/lyf-coder/single-package-template.git',
    ],
    [`input template git url`, ''],
]);

/**
 * project package info questions
 */
const questions = [
    {
        type: 'input',
        name: 'package.description',
        message: 'please input project description: ',
    },
    {
        type: 'input',
        name: 'package.keywords',
        message: 'please input keywords about project (split by space): ',
    },
];

/**
 * input some msg about project
 * @param projectName project name
 */
const inputProjectMsg = async (projectName: string) => {
    try {
        // ask questions about project
        const answers = await inquirer.prompt(questions);

        // read package.json file
        const packageFilePath = `./${projectName}/package.json`;

        const packageConf = await jsonfile.readFile(packageFilePath);

        // version
        packageConf.version = '1.0.0';

        // project name
        packageConf.name = projectName;

        // description
        const description = answers.package.description;
        packageConf.description = description;

        // keywords
        const keywords = answers.package.keywords;
        packageConf.keywords = keywords.split(' ');

        await jsonfile.writeFile(packageFilePath, packageConf, { spaces: 2 });

        log.success(`ceate project: ${projectName} success ! `);
    } catch (e) {
        log.error((e as Error).message);
    }
};

/**
 * download project template
 * @param projectName project name
 * @param templateUrl template git url
 */
const downloadTemplate = (projectName: string, templateUrl: string) => {
    const pwd = shell.pwd();
    log.info(`is downloading: ${pwd}/${projectName}/ ...`);
    log.info(templateUrl);
    clone(`${templateUrl}`, `${pwd}/${projectName}`, undefined, function () {
        // rm .git dir
        shell.rm('-rf', `${pwd}/${projectName}/.git`);
        log.success('download success! ');
        // input project msg
        inputProjectMsg(projectName);
    });
};

// main
program.version('1.0.0').description('project cli');
program
    .argument('[projectName]', 'project name')
    .action(async function (projectName) {
        if (!projectName || projectName.length === 0) {
            const projectAnswer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'please input your project name: ',
                },
            ]);
            projectName = projectAnswer.projectName;
        }

        if (projectName && projectName.length > 0) {
            // please select template
            const answer = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'templateName',
                    message: 'please select your project template: ',
                    choices: Array.from(templateMap.keys()),
                },
            ]);
            let url = templateMap.get(answer.templateName);
            if (!url || url.length == 0) {
                // input url
                const urlAnswer = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'url',
                        message: 'please input template git url: ',
                    },
                ]);
                url = urlAnswer.url;
            }
            if (!url || url.length == 0) {
                log.error(`template git url can't be empty!`);
            } else {
                downloadTemplate(projectName, url);
            }
        } else {
            log.error('correct example: project-cli myProject');
        }
    });

program.parse(process.argv);
