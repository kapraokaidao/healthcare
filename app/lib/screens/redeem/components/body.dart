import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchToken() async {
    final response =
        await HttpClient.get(path: '/healthcare-token/balance/${315}');
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchToken(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final token = snapshot.data;
                return Column(
                  children: [
                    Container(
                        margin: EdgeInsets.all(20),
                        padding: EdgeInsets.all(20),
                        child: Table(
                          children: [
                            TableRow(children: [
                              Text('Name',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                              Text(token["healthcareToken"]["name"])
                            ]),
                            rowSpacer,
                            TableRow(children: [
                              Text('Description',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                              Text(token["healthcareToken"]["description"])
                            ]),
                            rowSpacer,
                            TableRow(children: [
                              Text('Balance',
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                              Text('${token["balance"]}')
                            ])
                          ],
                        ),
                        width: double.infinity,
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: Colors.white,
                            border: Border.all(
                              color: Colors.grey,
                              style: BorderStyle.solid,
                              width: 1,
                            ))),
                    QrImage(
                      data: "{\"userId\":230,\"serviceId\":319}",
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                  ],
                );
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
