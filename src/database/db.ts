import SQLite from 'react-native-sqlite-storage';

// Habilitar el modo de depuración
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const getDBConnection = async () => {
  try {
    return await SQLite.openDatabase({name: 'accounts.db', location: 'default'});
  } catch (error) {
    console.error('Error abriendo la base de datos:', error);
    throw error; // Lanzar error para capturarlo en el uso
  }
};

export const createTable = async () => {
  try {
    const db = await getDBConnection();
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        secret TEXT
      );`
    );
  } catch (error) {
    console.error('Error al crear la tabla:', error);
    throw error;
  }
};

export const getAccounts = async (callback: (accounts: any[]) => void) => {
  try {
    const db = await getDBConnection();
    db.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='accounts';`,
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                secret TEXT
              );`,
              [],
              () => {
                tx.executeSql(
                  'SELECT * FROM accounts;',
                  [],
                  (_, { rows }) => {
                    const accounts: any[] = [];
                    for (let i = 0; i < rows.length; i++) {
                      accounts.push(rows.item(i));
                    }
                    callback(accounts);
                  },
                  error => {
                    console.error('Error en la consulta SELECT:', error);
                  }
                );
              },
              error => {
                console.error('Error al crear la tabla:', error);
              }
            );
          } else {
            tx.executeSql(
              'SELECT * FROM accounts;',
              [],
              (_, { rows }) => {
                const accounts: any[] = [];
                for (let i = 0; i < rows.length; i++) {
                  accounts.push(rows.item(i));
                }
                callback(accounts);
              },
              error => {
                console.error('Error en la consulta SELECT:', error);
              }
            );
          }
        },
        error => {
          console.error('Error verificando la existencia de la tabla:', error);
        }
      );
    });
  } catch (error) {
    console.error('Error obteniendo las cuentas:', error);
    throw error;
  }
};

export const insertAccount = async (email: string, secret: string, issuer: string) => {
  const db = await getDBConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM accounts WHERE email = ?;',
        [email],
        (_: any, { rows }: any) => {
          if (rows.length > 0) {
            resolve(false); // La cuenta ya existe
          } else {
            tx.executeSql(
              'INSERT INTO accounts (name, email, secret) VALUES (?, ?, ?);',
              [issuer, email, secret],
              () => resolve(true),
              (_: any, error: any) => reject(error)
            );
          }
        },
        (_: any, error: any) => reject(error)
      );
    });
  });
};


//obtener la cuenta por id
export const getAccountById = async (id: number) => {
  const db = await getDBConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM accounts WHERE id = ?;',
        [id],
        (_: any, { rows }: any) => resolve(rows.item(0)),
        (_: any, error: any) => reject(error)
      );
    });
  });
};

// update account
export const updateAccount = async (id: number, email: string, secret: string, issuer: string) => {
  const db = await getDBConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE accounts SET name = ?, email = ?, secret = ? WHERE id = ?;',
        [issuer, email, secret, id],
        () => resolve(true),
        (_: any, error: any) => reject(error)
      );
    });
  });
};

export const deleteAccount = async (id: number) => {
  const db = await getDBConnection();
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM accounts WHERE id = ?;',
        [id],
        () => resolve(true),
        (_: any, error: any) => reject(error)
      );
    });
  });
};