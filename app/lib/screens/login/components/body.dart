import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/account/account_screen.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class Body extends StatelessWidget {
  final nationalIdController = TextEditingController();
  final pinController = TextEditingController();

  _login(context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final response = await http
        .post("https://dev-healthcare-backend.kaoths.dev/patient/login", body: {
      "username": nationalIdController.text,
      "password": pinController.text
    });
    final responseJson = jsonDecode(response.body);
    final access_token = responseJson['access_token'];
    prefs.setString('access_token', access_token);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => TokenScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(40),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              'Login',
              style: TextStyle(fontSize: 40),
            ),
            Container(
              child: Column(
                children: [
                  Row(
                    children: [
                      Text('National ID'),
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(left: 10),
                          child: TextField(
                            controller: nationalIdController,
                            decoration:
                                const InputDecoration(hintText: 'National ID'),
                          ),
                        ),
                      )
                    ],
                  ),
                  Row(
                    children: [
                      Text('PIN'),
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(left: 10),
                          child: TextField(
                            controller: pinController,
                            obscureText: true,
                            decoration: const InputDecoration(hintText: 'PIN'),
                          ),
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
            Column(
              children: [
                OutlineButton(
                  onPressed: () => _login(context),
                  child: Text('Login'),
                ),
                OutlineButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => StartScreen()),
                    );
                  },
                  child: Text('Back'),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
