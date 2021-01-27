import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    final response = await HttpClient.get(path: '/healthcare-token/balance');
    print(response);
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final user = snapshot.data;
                return DataTable(
                  columns: const <DataColumn>[
                    DataColumn(
                      label: Text(
                        'Token name',
                        style: TextStyle(fontStyle: FontStyle.italic),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Quality',
                        style: TextStyle(fontStyle: FontStyle.italic),
                      ),
                    ),
                  ],
                  rows: const <DataRow>[
                    DataRow(
                      cells: <DataCell>[
                        DataCell(Text('Sarah')),
                        DataCell(Text('19')),
                      ],
                    ),
                    DataRow(
                      cells: <DataCell>[
                        DataCell(Text('Janine')),
                        DataCell(Text('43')),
                      ],
                    ),
                    DataRow(
                      cells: <DataCell>[
                        DataCell(Text('William')),
                        DataCell(Text('27')),
                      ],
                    ),
                  ],
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
