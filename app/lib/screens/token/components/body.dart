import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/utils/http_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    final response = await HttpClient.get(path: '/healthcare-token/balance');
    //print(response);
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  _logout(context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove('access_token');
    Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => StartScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final users = snapshot.data["data"];
                List<Map<String, dynamic>> show = new List();
                for (var data in users) {
                  show.add({
                    "name": data['healthcareToken']['name'],
                    "balance": data['balance'].toString(),
                  });
                }
                return DataTable(
                  headingRowColor:
                      MaterialStateColor.resolveWith((states) => Colors.orange),
                  columns: const <DataColumn>[
                    DataColumn(
                      label: Text(
                        'Token name',
                        style: TextStyle(
                            fontStyle: FontStyle.italic,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Quality',
                        style: TextStyle(
                            fontStyle: FontStyle.italic,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                  rows: show.map(
                    (user) {
                      return DataRow(cells: <DataCell>[
                        DataCell(
                          Text(user["name"]),
                        ),
                        DataCell(Text(user["balance"])),
                      ]);
                    },
                  ).toList(),
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
