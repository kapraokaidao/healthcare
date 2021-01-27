import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Body extends StatelessWidget {
  // Future<dynamic> fetchToken() async {
  //   final response = await HttpClient.get(path: '/user/me');
  //   final responseJson = jsonDecode(response.body);
  //   return responseJson;
  // }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
            margin: EdgeInsets.all(20),
            padding: EdgeInsets.all(20),
            child: Table(
              children: [
                TableRow(children: [
                  Text('First name',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("11111")
                ]),
                rowSpacer,
                TableRow(children: [
                  Text('Last name',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("222222")
                ]),
                rowSpacer,
                TableRow(children: [
                  Text('Gender', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("333333")
                ]),
                rowSpacer,
                TableRow(children: [
                  Text('Birth Date',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("4444444")
                ]),
                rowSpacer,
                TableRow(children: [
                  Text('Phone', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("5555555")
                ]),
                rowSpacer,
                TableRow(children: [
                  Text('Address',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Text("66666666")
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
          data: "1234567890",
          version: QrVersions.auto,
          size: 200.0,
        ),
      ],
    );
  }
}
