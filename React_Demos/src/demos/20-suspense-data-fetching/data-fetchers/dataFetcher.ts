import { wait } from '../helpers/helper';

const PROFILE = {
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    designation: 'Analyst',
}

const fetchProfile = async (delay = 1000, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        if (shouldFail) {
            wait(delay).then(() => {
                reject(new Error('Failed to fetch profile'));
            });
        }else{
            wait(delay).then(() => {
                resolve(PROFILE);
            })
        }
    })
}

export { fetchProfile };